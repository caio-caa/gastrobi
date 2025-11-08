/*
  # Dados iniciais do sistema

  1. Planos de assinatura
  2. Usuário super admin
  3. Restaurante de exemplo
  4. Dados de exemplo
*/

-- Inserir planos de assinatura
INSERT INTO subscription_plans (name, type, price_monthly, price_yearly, max_restaurants, max_users, max_products, max_customers, features) VALUES
(
  'Básico',
  'basic',
  47.00,
  470.00,
  1,
  3,
  50,
  500,
  '{
    "cardapio_digital": true,
    "qr_codes": true,
    "pos_basico": true,
    "relatorios_basicos": true,
    "suporte_email": true,
    "campanhas_limitadas": 10
  }'
),
(
  'Premium',
  'premium',
  97.00,
  970.00,
  3,
  10,
  200,
  2000,
  '{
    "cardapio_digital": true,
    "qr_codes": true,
    "pos_completo": true,
    "relatorios_avancados": true,
    "campanhas_ilimitadas": true,
    "integracao_whatsapp": true,
    "integracao_delivery": true,
    "suporte_prioritario": true,
    "multi_restaurantes": true
  }'
),
(
  'Enterprise',
  'enterprise',
  197.00,
  1970.00,
  10,
  50,
  1000,
  10000,
  '{
    "cardapio_digital": true,
    "qr_codes": true,
    "pos_completo": true,
    "relatorios_avancados": true,
    "campanhas_ilimitadas": true,
    "integracao_whatsapp": true,
    "integracao_delivery": true,
    "api_acesso": true,
    "suporte_dedicado": true,
    "multi_restaurantes": true,
    "white_label": true,
    "backup_automatico": true
  }'
);

-- Criar função para inserir usuário super admin (será executada após auth.users ser criado)
CREATE OR REPLACE FUNCTION create_super_admin_profile()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Verificar se já existe um super admin
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE role = 'super_admin') THEN
    -- Inserir perfil de super admin (assumindo que o usuário auth já existe)
    -- Em produção, isso seria feito através do signup
    INSERT INTO user_profiles (
      id,
      email,
      full_name,
      role,
      is_active,
      email_verified
    ) VALUES (
      gen_random_uuid(), -- Temporário, será substituído pelo ID real do auth.users
      'admin@gastrobi.com',
      'Administrador do Sistema',
      'super_admin',
      true,
      true
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Inserir restaurante de exemplo
INSERT INTO restaurants (
  name,
  slug,
  cnpj,
  email,
  phone,
  address,
  city,
  state,
  zip_code,
  description,
  status,
  settings
) VALUES (
  'Restaurante do João',
  'restaurante-do-joao',
  '12.345.678/0001-90',
  'contato@restaurantedojoao.com.br',
  '(11) 99999-9999',
  'Rua das Flores, 123 - Centro',
  'São Paulo',
  'SP',
  '01234-567',
  'Restaurante especializado em culinária italiana com ambiente aconchegante.',
  'active',
  '{
    "timezone": "America/Sao_Paulo",
    "currency": "BRL",
    "loyalty_program": {
      "enabled": true,
      "points_per_real": 1,
      "bronze_threshold": 0,
      "silver_threshold": 200,
      "gold_threshold": 500
    },
    "notifications": {
      "email": true,
      "sms": true,
      "whatsapp": true
    },
    "opening_hours": {
      "monday": {"open": "11:00", "close": "23:00", "closed": false},
      "tuesday": {"open": "11:00", "close": "23:00", "closed": false},
      "wednesday": {"open": "11:00", "close": "23:00", "closed": false},
      "thursday": {"open": "11:00", "close": "23:00", "closed": false},
      "friday": {"open": "11:00", "close": "23:00", "closed": false},
      "saturday": {"open": "11:00", "close": "23:00", "closed": false},
      "sunday": {"open": "11:00", "close": "22:00", "closed": false}
    }
  }'
);

-- Atualizar dados existentes com restaurant_id
UPDATE customers SET restaurant_id = (SELECT id FROM restaurants WHERE slug = 'restaurante-do-joao' LIMIT 1);
UPDATE products SET restaurant_id = (SELECT id FROM restaurants WHERE slug = 'restaurante-do-joao' LIMIT 1);
UPDATE campaigns SET restaurant_id = (SELECT id FROM restaurants WHERE slug = 'restaurante-do-joao' LIMIT 1);
UPDATE loyalty_rules SET restaurant_id = (SELECT id FROM restaurants WHERE slug = 'restaurante-do-joao' LIMIT 1);