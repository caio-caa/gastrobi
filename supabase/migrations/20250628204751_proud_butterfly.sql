/*
  # Dados de exemplo para o GastroBI+

  1. Produtos de exemplo
  2. Clientes de exemplo
  3. Regras de fidelidade
  4. Campanhas de exemplo
*/

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, cost, category, preparation_time, popularity, is_active, is_available) VALUES
('Hambúrguer Clássico', 'Pão brioche, carne 180g, queijo cheddar, alface, tomate e molho especial', 25.90, 12.50, 'Lanches', 15, 85, true, true),
('Pizza Margherita', 'Molho de tomate, mussarela, manjericão fresco e azeite', 35.90, 18.00, 'Pizzas', 20, 92, true, true),
('Refrigerante Lata', 'Coca-Cola, Pepsi, Guaraná ou Fanta - 350ml', 5.50, 2.80, 'Bebidas', 1, 78, true, true),
('Batata Frita', 'Batata rústica temperada com ervas', 12.90, 5.20, 'Acompanhamentos', 10, 65, true, true),
('Cerveja Long Neck', 'Cerveja gelada 355ml', 8.90, 4.50, 'Bebidas', 2, 70, true, true),
('Pizza Pepperoni', 'Molho de tomate, mussarela e pepperoni', 42.90, 22.00, 'Pizzas', 20, 88, true, true),
('Hambúrguer Bacon', 'Pão brioche, carne 180g, bacon, queijo, alface e molho barbecue', 32.90, 16.80, 'Lanches', 18, 80, true, true),
('Salada Caesar', 'Alface romana, frango grelhado, parmesão, croutons e molho caesar', 24.90, 12.00, 'Saladas', 8, 60, true, true),
('Suco Natural', 'Laranja, limão, maracujá ou acerola - 400ml', 8.50, 3.20, 'Bebidas', 3, 55, true, true),
('Pudim de Leite', 'Pudim caseiro com calda de caramelo', 12.90, 4.50, 'Sobremesas', 5, 45, true, false);

-- Inserir clientes de exemplo
INSERT INTO customers (name, email, phone, points, level, status, total_spent, visit_count, last_visit) VALUES
('Maria Silva', 'maria@email.com', '(11) 99999-1111', 285, 'gold', 'active', 2850.50, 45, now() - interval '2 days'),
('João Santos', 'joao@email.com', '(11) 88888-2222', 120, 'silver', 'inactive', 1200.00, 20, now() - interval '15 days'),
('Ana Costa', 'ana@email.com', '(11) 77777-3333', 89, 'bronze', 'active', 890.30, 12, now() - interval '1 day'),
('Pedro Oliveira', 'pedro@email.com', '(11) 66666-4444', 340, 'gold', 'active', 3200.80, 52, now() - interval '3 days'),
('Carla Mendes', 'carla@email.com', '(11) 55555-5555', 156, 'silver', 'active', 1560.90, 28, now() - interval '5 days');

-- Inserir regras de fidelidade
INSERT INTO loyalty_rules (name, type, points, description, is_active) VALUES
('Compra realizada', 'purchase', 10, '10 pontos a cada R$ 10,00 gastos', true),
('Check-in no restaurante', 'checkin', 25, '25 pontos por check-in via app', true),
('Aniversário', 'birthday', 100, '100 pontos no mês do aniversário', true),
('Indicação de amigo', 'referral', 150, '150 pontos por amigo que fizer primeira compra', true),
('Compartilhamento social', 'social_share', 20, '20 pontos por compartilhamento nas redes sociais', true),
('Avaliação no Google', 'review', 50, '50 pontos por avaliação 5 estrelas no Google', true);

-- Inserir campanhas de exemplo
INSERT INTO campaigns (name, type, status, target_audience, message, sent_count, open_rate, click_rate, redeem_rate) VALUES
('Promoção de Fim de Semana', 'whatsapp', 'sent', 'Clientes Ativos', '🍕 Promoção especial! 20% off em todas as pizzas neste fim de semana!', 234, 78.5, 23.2, 12.8),
('Reativação de Clientes', 'email', 'scheduled', 'Clientes Inativos', 'Sentimos sua falta! Volte e ganhe 50% de desconto no seu próximo pedido.', 0, 0, 0, 0),
('Lançamento Novo Produto', 'sms', 'draft', 'Todos os Clientes', 'Novidade! Experimente nosso novo hambúrguer artesanal. Peça já!', 0, 0, 0, 0);