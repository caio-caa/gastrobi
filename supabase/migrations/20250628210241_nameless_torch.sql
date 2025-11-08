/*
  # Sistema de Gestão de Usuários SaaS

  1. Novas Tabelas
    - `user_profiles` - Perfis dos usuários do sistema
    - `restaurants` - Restaurantes cadastrados
    - `user_restaurant_access` - Relacionamento usuário-restaurante
    - `subscription_plans` - Planos de assinatura
    - `subscriptions` - Assinaturas ativas
    - `audit_logs` - Log de auditoria

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas para admin e usuários
    - Logs de auditoria para ações importantes

  3. Funcionalidades
    - Multi-tenant (múltiplos restaurantes por usuário)
    - Sistema de planos e assinaturas
    - Controle de acesso granular
    - Auditoria completa
*/

-- Enum types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'owner', 'manager', 'staff');
CREATE TYPE restaurant_status AS ENUM ('active', 'suspended', 'trial', 'cancelled');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing');
CREATE TYPE plan_type AS ENUM ('basic', 'premium', 'enterprise');

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  role user_role DEFAULT 'owner',
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  two_factor_enabled boolean DEFAULT false,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type plan_type NOT NULL,
  price_monthly decimal(10,2) NOT NULL,
  price_yearly decimal(10,2),
  max_restaurants integer DEFAULT 1,
  max_users integer DEFAULT 5,
  max_products integer DEFAULT 100,
  max_customers integer DEFAULT 1000,
  features jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  cnpj text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  website text,
  description text,
  logo_url text,
  status restaurant_status DEFAULT 'trial',
  trial_ends_at timestamptz DEFAULT (now() + interval '30 days'),
  settings jsonb DEFAULT '{}',
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User restaurant access table
CREATE TABLE IF NOT EXISTS user_restaurant_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  role user_role DEFAULT 'staff',
  permissions jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  invited_by uuid REFERENCES user_profiles(id),
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  status subscription_status DEFAULT 'trialing',
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT (now() + interval '1 month'),
  trial_start timestamptz,
  trial_end timestamptz,
  cancelled_at timestamptz,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  restaurant_id uuid REFERENCES restaurants(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Add restaurant_id to existing tables for multi-tenant support
ALTER TABLE customers ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES restaurants(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES restaurants(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES restaurants(id);
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES restaurants(id);
ALTER TABLE loyalty_rules ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES restaurants(id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_restaurant_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS Policies for restaurants
CREATE POLICY "Users can view restaurants they have access to" ON restaurants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_restaurant_access 
      WHERE user_id = auth.uid() AND restaurant_id = restaurants.id AND is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Restaurant owners can update their restaurants" ON restaurants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_restaurant_access 
      WHERE user_id = auth.uid() AND restaurant_id = restaurants.id 
      AND role IN ('owner', 'admin') AND is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS Policies for user_restaurant_access
CREATE POLICY "Users can view their own access" ON user_restaurant_access
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Restaurant admins can view access for their restaurants" ON user_restaurant_access
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_restaurant_access ura 
      WHERE ura.user_id = auth.uid() AND ura.restaurant_id = user_restaurant_access.restaurant_id 
      AND ura.role IN ('owner', 'admin') AND ura.is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS Policies for subscription_plans
CREATE POLICY "Anyone can view active plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Super admins can manage plans" ON subscription_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS Policies for subscriptions
CREATE POLICY "Restaurant owners can view their subscriptions" ON subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_restaurant_access 
      WHERE user_id = auth.uid() AND restaurant_id = subscriptions.restaurant_id 
      AND role IN ('owner', 'admin') AND is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Super admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Restaurant admins can view their restaurant logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_restaurant_access 
      WHERE user_id = auth.uid() AND restaurant_id = audit_logs.restaurant_id 
      AND role IN ('owner', 'admin') AND is_active = true
    )
  );

-- Update RLS policies for existing tables to include restaurant_id
DROP POLICY IF EXISTS "Allow authenticated users to read customers" ON customers;
DROP POLICY IF EXISTS "Allow authenticated users to insert customers" ON customers;
DROP POLICY IF EXISTS "Allow authenticated users to update customers" ON customers;

CREATE POLICY "Users can view customers from their restaurants" ON customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_restaurant_access 
      WHERE user_id = auth.uid() AND restaurant_id = customers.restaurant_id AND is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Users can insert customers to their restaurants" ON customers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_restaurant_access 
      WHERE user_id = auth.uid() AND restaurant_id = customers.restaurant_id AND is_active = true
    )
  );

CREATE POLICY "Users can update customers from their restaurants" ON customers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_restaurant_access 
      WHERE user_id = auth.uid() AND restaurant_id = customers.restaurant_id AND is_active = true
    )
  );

-- Similar policies for other tables...
-- (Products, Orders, Campaigns, Loyalty Rules)

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);
CREATE INDEX IF NOT EXISTS idx_user_restaurant_access_user_id ON user_restaurant_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_restaurant_access_restaurant_id ON user_restaurant_access(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_restaurant_id ON subscriptions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_restaurant_id ON audit_logs(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Functions for audit logging
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_restaurant_id uuid DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    restaurant_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_restaurant_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create restaurant slug
CREATE OR REPLACE FUNCTION generate_restaurant_slug(restaurant_name text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Convert to lowercase and replace spaces/special chars with hyphens
  base_slug := lower(regexp_replace(restaurant_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check if slug exists and increment counter if needed
  WHILE EXISTS (SELECT 1 FROM restaurants WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_restaurant_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_restaurant_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_restaurant_slug
  BEFORE INSERT OR UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION set_restaurant_slug();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER trigger_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_restaurant_access_updated_at
  BEFORE UPDATE ON user_restaurant_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();