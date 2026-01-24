# ⚠️ APIs Necessárias no Backend - GastroBI Business Model

## 📋 Resumo

Para implementar completamente o modelo de negócio da GastroBI (Delivery/Takeaway com Pagamento Online), os seguintes endpoints precisam ser criados ou atualizados no backend.

---

## 🔴 CRÍTICO - Necessário para MVP

### 1. **Criar Pedido**
```
POST /orders
Content-Type: application/json

{
  "restaurantId": "rest_123",
  "type": "DELIVERY" | "TAKEAWAY",
  "items": [
    {
      "productId": "prod_456",
      "quantity": 2,
      "price": 25.00,
      "extras": []
    }
  ],
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+55 11 98765-4321"
  },
  "delivery": {
    "address": "Rua das Flores",
    "number": "123",
    "complement": "Apto 42",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "zipCode": "01234-567"
  },
  "takeaway": {
    "estimatedTime": "2025-01-24T18:30:00Z"
  },
  "payment": {
    "method": "PIX" | "CARD",
    "amount": 75.00
  },
  "discount": {
    "coupon": "PRIMEIRA_COMPRA",
    "amount": 5.00
  },
  "tip": 2.50
}

Response 201:
{
  "id": "ord_789",
  "restaurantId": "rest_123",
  "type": "DELIVERY",
  "status": "PENDING",
  "items": [...],
  "customer": {...},
  "delivery": {...},
  "payment": {
    "id": "pay_123",
    "method": "PIX",
    "status": "PENDING",
    "amount": 75.00,
    "pixQrCode": "00020126...", // Para Pix
    "cardToken": "tok_123..." // Para Card
  },
  "total": 72.50,
  "createdAt": "2025-01-24T18:00:00Z"
}
```

### 2. **Rastrear Pedido**
```
GET /orders/:orderId

Response 200:
{
  "id": "ord_789",
  "restaurantId": "rest_123",
  "type": "DELIVERY",
  "status": "PREPARING", // PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED
  "items": [...],
  "customer": {...},
  "delivery": {...},
  "payment": {...},
  "estimatedDeliveryTime": "2025-01-24T18:45:00Z",
  "createdAt": "2025-01-24T18:00:00Z",
  "updatedAt": "2025-01-24T18:20:00Z"
}
```

### 3. **Processar Pagamento**
```
POST /payments
Content-Type: application/json

{
  "orderId": "ord_789",
  "method": "PIX" | "CARD",
  "amount": 72.50,
  "cardToken": "tok_123" // Apenas para CARD
}

Response 201:
{
  "id": "pay_123",
  "orderId": "ord_789",
  "method": "PIX",
  "status": "PENDING",
  "amount": 72.50,
  "pixQrCode": "00020126...",
  "pixExpiration": "2025-01-24T18:30:00Z",
  "createdAt": "2025-01-24T18:00:00Z"
}
```

### 4. **Confirmar Pagamento (Webhook)**
```
POST /payments/:paymentId/confirm
Content-Type: application/json

{
  "transactionId": "pix_trans_123",
  "status": "PAID"
}

Response 200:
{
  "id": "pay_123",
  "status": "PAID",
  "confirmedAt": "2025-01-24T18:15:00Z"
}

// Isso deve:
// 1. Atualizar status do pedido para CONFIRMED
// 2. Notificar cozinha
// 3. Enviar email/WhatsApp ao cliente
```

### 5. **Obter Configurações do Restaurante**
```
GET /restaurants/:slug/settings

Response 200:
{
  "restaurantId": "rest_123",
  "slug": "restaurante-xyzz",
  "name": "Restaurante XYZ",
  "isOpen": true,
  "operatingHours": {
    "monday": { "open": "11:00", "close": "22:00" },
    "tuesday": { "open": "11:00", "close": "22:00" },
    "wednesday": { "open": "11:00", "close": "22:00" },
    "thursday": { "open": "11:00", "close": "22:00" },
    "friday": { "open": "11:00", "close": "23:00" },
    "saturday": { "open": "12:00", "close": "23:00" },
    "sunday": { "open": "12:00", "close": "22:00" }
  },
  "delivery": {
    "enabled": true,
    "fee": 5.00,
    "minOrder": 20.00,
    "areas": [
      {
        "neighborhood": "Centro",
        "fee": 3.00
      }
    ]
  },
  "takeaway": {
    "enabled": true,
    "minOrder": 15.00
  },
  "paymentMethods": ["PIX", "CARD"],
  "whiteLabel": {
    "primaryColor": "#007AFF",
    "logo": "https://..."
  }
}
```

---

## 🟡 IMPORTANTE - Necessário Depois

### 6. **Listar Pedidos do Cliente**
```
GET /customers/:email/orders

Response 200:
{
  "orders": [
    {
      "id": "ord_789",
      "restaurantName": "Restaurante XYZ",
      "type": "DELIVERY",
      "status": "DELIVERED",
      "total": 72.50,
      "createdAt": "2025-01-24T18:00:00Z"
    }
  ]
}
```

### 7. **Validar Cupom de Desconto**
```
POST /coupons/validate
Content-Type: application/json

{
  "code": "PRIMEIRA_COMPRA",
  "restaurantId": "rest_123",
  "orderTotal": 75.00
}

Response 200:
{
  "valid": true,
  "discount": 5.00,
  "type": "FIXED" | "PERCENT",
  "minOrder": 20.00
}
```

### 8. **WebSocket para Atualizações em Tempo Real** (Optional para MVP)
```
ws://localhost:3001/socket/orders/:orderId

Emits:
- "order:status-updated" -> { status: "PREPARING" }
- "order:estimated-time-updated" -> { estimatedTime: "18:45" }
- "payment:confirmed" -> { status: "PAID" }
```

---

## 📋 Campos Obrigatórios - Tabelas do Banco

### Tabela: `orders`
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  restaurantId VARCHAR(36) NOT NULL,
  type VARCHAR(10) NOT NULL, -- DELIVERY, TAKEAWAY
  status VARCHAR(20) NOT NULL, -- PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED
  
  -- Customer
  customerName VARCHAR(100) NOT NULL,
  customerEmail VARCHAR(100) NOT NULL,
  customerPhone VARCHAR(20) NOT NULL,
  
  -- Delivery
  deliveryAddress VARCHAR(255),
  deliveryNumber VARCHAR(10),
  deliveryComplement VARCHAR(100),
  deliveryNeighborhood VARCHAR(100),
  deliveryCity VARCHAR(100),
  deliveryZipCode VARCHAR(10),
  
  -- Takeaway
  takeawayEstimatedTime DATETIME,
  
  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  deliveryFee DECIMAL(10, 2),
  discount DECIMAL(10, 2),
  tip DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  paymentMethod VARCHAR(10), -- PIX, CARD
  paymentStatus VARCHAR(20), -- PENDING, PAID, FAILED
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id)
);
```

### Tabela: `order_items`
```sql
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  orderId VARCHAR(36) NOT NULL,
  productId VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

### Tabela: `payments`
```sql
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  orderId VARCHAR(36) NOT NULL,
  method VARCHAR(10) NOT NULL, -- PIX, CARD
  status VARCHAR(20) NOT NULL, -- PENDING, PAID, FAILED
  amount DECIMAL(10, 2) NOT NULL,
  
  -- PIX
  pixQrCode TEXT,
  pixKey VARCHAR(255),
  
  -- Card
  cardToken VARCHAR(255),
  
  -- External Transaction
  externalTransactionId VARCHAR(255),
  externalProvider VARCHAR(50), -- STRIPE, MERCADOPAGO, etc
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmedAt TIMESTAMP,
  
  FOREIGN KEY (orderId) REFERENCES orders(id)
);
```

---

## 🔗 Integrações Externas Necessárias

### Pix (BCB - Banco Central)
- [ ] Integração com provedor de Pix (ex: Stripe, MercadoPago, Asaas)
- [ ] Geração de QR Code
- [ ] Validação de recebimento
- [ ] Webhook para confirmação de pagamento

### Cartão de Crédito
- [ ] Integração com gateway de pagamento (ex: Stripe, MercadoPago)
- [ ] Tokenização de cartão
- [ ] Parcelamento em 3x (opcional)
- [ ] Webhook para confirmação de pagamento

---

## ✅ Checklist de Implementação

### Backend
- [ ] Criar tabelas no banco de dados
- [ ] Implementar POST /orders
- [ ] Implementar GET /orders/:orderId
- [ ] Implementar POST /payments
- [ ] Implementar POST /payments/:paymentId/confirm (webhook)
- [ ] Implementar GET /restaurants/:slug/settings
- [ ] Integrar com Pix
- [ ] Integrar com Cartão
- [ ] Validar endereço de entrega
- [ ] Calcular taxa de entrega
- [ ] Notificar restaurante (email/WhatsApp)
- [ ] Notificar cliente (email/WhatsApp)

### Frontend
- [ ] Criar página /order/[slug] (com carrinho)
- [ ] Integrar OrderTypeSelector
- [ ] Integrar AddressForm (Delivery)
- [ ] Integrar TimeSelector (Takeaway)
- [ ] Integrar PaymentMethod
- [ ] Integrar CheckoutSummary
- [ ] Criar página de confirmação de pagamento
- [ ] Criar página /orders/[id] (rastreamento)
- [ ] Integrar WebSocket (opcional)

---

## 🚨 Notas Importantes

1. **Segurança**: Todos os dados de pagamento devem ser criptografados
2. **Validação**: Validar endereço antes de calcular taxa de entrega
3. **Notificações**: Integrar com WhatsApp/Email para notificações
4. **Rate Limiting**: Implementar rate limiting para endpoints de pedido
5. **Logs**: Logar todas as transações de pagamento para auditoria

---

**Status**: ⏳ Aguardando implementação no backend
**Prioridade**: 🔴 CRÍTICO para MVP
**Estimado**: 2-3 dias de desenvolvimento
