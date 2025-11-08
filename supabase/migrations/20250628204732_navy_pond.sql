/*
  # Schema inicial do GastroBI+

  1. Tabelas principais
    - customers: dados dos clientes
    - products: produtos do cardápio
    - orders: pedidos realizados
    - order_items: itens dos pedidos
    - campaigns: campanhas de marketing
    - loyalty_rules: regras de fidelidade

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para acesso autenticado
*/

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  points integer DEFAULT 0,
  level text DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  total_spent decimal(10,2) DEFAULT 0,
  visit_count integer DEFAULT 0,
  last_visit timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  cost decimal(10,2) DEFAULT 0,
  category text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  is_available boolean DEFAULT true,
  preparation_time integer DEFAULT 0,
  popularity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  type text NOT NULL CHECK (type IN ('balcao', 'delivery', 'mesa', 'comanda')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'preparing', 'ready', 'completed', 'cancelled')),
  total decimal(10,2) NOT NULL,
  payment_method text,
  table_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  observations text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('whatsapp', 'email', 'sms')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'active', 'paused')),
  target_audience text,
  message text NOT NULL,
  sent_count integer DEFAULT 0,
  open_rate decimal(5,2) DEFAULT 0,
  click_rate decimal(5,2) DEFAULT 0,
  redeem_rate decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Loyalty rules table
CREATE TABLE IF NOT EXISTS loyalty_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'checkin', 'birthday', 'referral', 'social_share', 'review')),
  points integer NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permitir acesso para usuários autenticados)
CREATE POLICY "Allow authenticated users to read customers" ON customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert customers" ON customers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update customers" ON customers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read products" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read orders" ON orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update orders" ON orders
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read order_items" ON order_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert order_items" ON order_items
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update order_items" ON order_items
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read campaigns" ON campaigns
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert campaigns" ON campaigns
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update campaigns" ON campaigns
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read loyalty_rules" ON loyalty_rules
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert loyalty_rules" ON loyalty_rules
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update loyalty_rules" ON loyalty_rules
  FOR UPDATE TO authenticated USING (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(type);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);