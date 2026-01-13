# 🚨 Endpoints Faltantes - GastroBI+ Backend

**Data:** 13/01/2026  
**Prioridade:** ALTA  
**Base URL:** `http://localhost:3000/api/v1`

> Estes endpoints são necessários para o frontend funcionar corretamente.
> Todos requerem `Authorization: Bearer <token>` e `x-restaurant-id: <uuid>`

---

## 1. Dashboard / Analytics

### 1.1 Obter Métricas do Dashboard

**GET** `/dashboard/metrics`

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| period | enum | Não | `today`, `week`, `month`, `year` (default: `today`) |

**Resposta Esperada (200):**
```json
{
  "revenue": {
    "total": 15420.50,
    "daily": 892.30,
    "weekly": 5420.00,
    "monthly": 15420.50,
    "previousPeriodChange": 12.5
  },
  "orders": {
    "total": 245,
    "today": 48,
    "pending": 5,
    "preparing": 3,
    "completed": 240,
    "cancelled": 2,
    "previousPeriodChange": 8.3
  },
  "customers": {
    "total": 156,
    "active": 120,
    "inactive": 36,
    "new": 15,
    "vip": 25,
    "previousPeriodChange": 15.2
  },
  "averageTicket": {
    "value": 67.80,
    "previousPeriodChange": 3.7
  },
  "loyalty": {
    "totalPoints": 12500,
    "averagePoints": 80,
    "redemptions": 45
  }
}
```

---

### 1.2 Obter Dados Mensais (Gráficos)

**GET** `/dashboard/monthly`

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| year | number | Não | Ano (default: atual) |
| months | number | Não | Quantidade de meses (default: 6) |

**Resposta Esperada (200):**
```json
{
  "data": [
    {
      "month": "Jan",
      "year": 2026,
      "revenue": 12000.00,
      "orders": 180,
      "customers": 45,
      "averageTicket": 66.67
    },
    {
      "month": "Fev",
      "year": 2026,
      "revenue": 13500.00,
      "orders": 195,
      "customers": 52,
      "averageTicket": 69.23
    }
  ]
}
```

---

### 1.3 Produtos Mais Vendidos

**GET** `/dashboard/top-products`

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| limit | number | Não | Quantidade (default: 10) |
| period | enum | Não | `week`, `month`, `year` (default: `month`) |

**Resposta Esperada (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Pizza Margherita",
      "category": "Pizzas",
      "image": "https://...",
      "price": 45.90,
      "salesCount": 95,
      "revenue": 4360.50
    }
  ]
}
```

---

### 1.4 Pedidos Recentes

**GET** `/dashboard/recent-orders`

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| limit | number | Não | Quantidade (default: 10) |

**Resposta Esperada (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "orderNumber": 1001,
      "type": "DINE_IN",
      "tableNumber": "5",
      "status": "PREPARING",
      "total": 89.90,
      "itemsCount": 3,
      "createdAt": "2026-01-13T12:30:00.000Z",
      "customer": {
        "id": "uuid",
        "name": "João Silva"
      }
    }
  ]
}
```

---

## 2. Configurações do Restaurante

### 2.1 Obter Configurações

**GET** `/settings`

**Resposta Esperada (200):**
```json
{
  "restaurant": {
    "id": "uuid",
    "name": "Restaurante do João",
    "slug": "restaurante-do-joao",
    "cnpj": "12.345.678/0001-90",
    "address": "Rua das Flores, 123 - Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "phone": "(11) 99999-9999",
    "email": "contato@restaurante.com",
    "website": "www.restaurante.com.br",
    "description": "Restaurante especializado em culinária italiana",
    "logo": "https://...",
    "coverImage": "https://..."
  },
  "openingHours": {
    "monday": { "open": "11:00", "close": "23:00", "closed": false },
    "tuesday": { "open": "11:00", "close": "23:00", "closed": false },
    "wednesday": { "open": "11:00", "close": "23:00", "closed": false },
    "thursday": { "open": "11:00", "close": "23:00", "closed": false },
    "friday": { "open": "11:00", "close": "23:00", "closed": false },
    "saturday": { "open": "11:00", "close": "23:00", "closed": false },
    "sunday": { "open": "11:00", "close": "22:00", "closed": false }
  },
  "socialMedia": {
    "instagram": "@restaurante",
    "facebook": "restaurante",
    "whatsapp": "5511999999999"
  },
  "loyalty": {
    "enabled": true,
    "pointsPerReal": 1,
    "bronzeThreshold": 0,
    "silverThreshold": 200,
    "goldThreshold": 500,
    "platinumThreshold": 1000,
    "pointsExpiration": 365,
    "welcomeBonus": 50,
    "birthdayBonus": 100,
    "referralBonus": 150
  },
  "notifications": {
    "newCustomer": true,
    "campaignResults": true,
    "lowStock": false,
    "dailyReport": true,
    "orderReceived": true,
    "paymentReceived": true,
    "systemUpdates": false
  },
  "integrations": {
    "whatsapp": {
      "enabled": true,
      "phoneNumber": "5511999999999"
    },
    "email": {
      "enabled": true,
      "provider": "sendgrid",
      "senderEmail": "noreply@restaurante.com"
    },
    "delivery": {
      "ifood": { "enabled": false, "storeId": null },
      "ubereats": { "enabled": false, "storeId": null },
      "rappi": { "enabled": false, "storeId": null }
    }
  }
}
```

---

### 2.2 Atualizar Configurações do Restaurante

**PATCH** `/settings/restaurant`

**Body:**
```json
{
  "name": "Restaurante do João",
  "cnpj": "12.345.678/0001-90",
  "address": "Rua das Flores, 123 - Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "phone": "(11) 99999-9999",
  "email": "contato@restaurante.com",
  "website": "www.restaurante.com.br",
  "description": "Descrição atualizada"
}
```

**Resposta (200):** Retorna o objeto restaurant atualizado.

---

### 2.3 Atualizar Horário de Funcionamento

**PATCH** `/settings/opening-hours`

**Body:**
```json
{
  "monday": { "open": "11:00", "close": "23:00", "closed": false },
  "tuesday": { "open": "11:00", "close": "23:00", "closed": false },
  "wednesday": { "open": "11:00", "close": "23:00", "closed": false },
  "thursday": { "open": "11:00", "close": "23:00", "closed": false },
  "friday": { "open": "11:00", "close": "23:00", "closed": false },
  "saturday": { "open": "11:00", "close": "23:00", "closed": false },
  "sunday": { "open": "11:00", "close": "22:00", "closed": false }
}
```

---

### 2.4 Atualizar Redes Sociais

**PATCH** `/settings/social-media`

**Body:**
```json
{
  "instagram": "@restaurante",
  "facebook": "restaurante",
  "whatsapp": "5511999999999"
}
```

---

### 2.5 Atualizar Configurações de Fidelidade

**PATCH** `/settings/loyalty`

**Body:**
```json
{
  "enabled": true,
  "pointsPerReal": 1,
  "bronzeThreshold": 0,
  "silverThreshold": 200,
  "goldThreshold": 500,
  "platinumThreshold": 1000,
  "pointsExpiration": 365,
  "welcomeBonus": 50,
  "birthdayBonus": 100,
  "referralBonus": 150
}
```

---

### 2.6 Atualizar Notificações

**PATCH** `/settings/notifications`

**Body:**
```json
{
  "newCustomer": true,
  "campaignResults": true,
  "lowStock": false,
  "dailyReport": true,
  "orderReceived": true,
  "paymentReceived": true,
  "systemUpdates": false
}
```

---

## 3. Alertas do Sistema

### 3.1 Listar Alertas

**GET** `/alerts`

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| isRead | boolean | Não | Filtrar por lidos/não lidos |
| type | enum | Não | `warning`, `info`, `success`, `error` |
| limit | number | Não | Quantidade (default: 50) |

**Resposta Esperada (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "warning",
      "priority": "medium",
      "title": "Cliente inativo detectado",
      "message": "João Santos não visita há 15 dias. Considere enviar uma campanha.",
      "actionUrl": "/customers/uuid",
      "isRead": false,
      "createdAt": "2026-01-13T10:00:00.000Z"
    }
  ],
  "unreadCount": 5
}
```

---

### 3.2 Marcar Alerta como Lido

**PATCH** `/alerts/:id/read`

**Resposta (200):**
```json
{
  "id": "uuid",
  "isRead": true
}
```

---

### 3.3 Marcar Todos como Lidos

**POST** `/alerts/read-all`

**Resposta (200):**
```json
{
  "updated": 5
}
```

---

## 4. Relatórios Avançados

### 4.1 Relatório de Vendas por Categoria

**GET** `/reports/sales-by-category`

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| startDate | ISO date | Sim | Data inicial |
| endDate | ISO date | Sim | Data final |

**Resposta Esperada (200):**
```json
{
  "data": [
    {
      "categoryId": "uuid",
      "categoryName": "Pizzas",
      "salesCount": 150,
      "revenue": 6885.00,
      "percentage": 45.5
    }
  ],
  "total": {
    "salesCount": 330,
    "revenue": 15130.00
  }
}
```

---

### 4.2 Relatório de Clientes por Nível

**GET** `/reports/customers-by-level`

**Resposta Esperada (200):**
```json
{
  "data": [
    { "level": "BRONZE", "count": 80, "percentage": 51.3 },
    { "level": "SILVER", "count": 45, "percentage": 28.8 },
    { "level": "GOLD", "count": 25, "percentage": 16.0 },
    { "level": "PLATINUM", "count": 6, "percentage": 3.9 }
  ],
  "total": 156
}
```

---

### 4.3 Exportar Relatório

**POST** `/reports/export`

**Body:**
```json
{
  "type": "sales",
  "format": "xlsx",
  "startDate": "2026-01-01",
  "endDate": "2026-01-13"
}
```

**Tipos:** `sales`, `customers`, `products`, `orders`, `campaigns`
**Formatos:** `xlsx`, `csv`, `pdf`

**Resposta (200):**
```json
{
  "downloadUrl": "https://cdn.gastrobi.com/exports/report-abc123.xlsx",
  "expiresAt": "2026-01-14T12:00:00.000Z"
}
```

---

## 5. Saúde da API

### 5.1 Health Check

**GET** `/health`

> Sem autenticação

**Resposta (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T12:00:00.000Z"
}
```

---

### 5.2 Ready Check

**GET** `/health/ready`

> Sem autenticação

**Resposta (200):**
```json
{
  "status": "ready",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2026-01-13T12:00:00.000Z"
}
```

---

## 📌 Resumo de Prioridades

| Endpoint | Prioridade | Usado em |
|----------|------------|----------|
| `GET /dashboard/metrics` | 🔴 ALTA | Dashboard |
| `GET /dashboard/monthly` | 🔴 ALTA | Dashboard, Reports |
| `GET /dashboard/top-products` | 🟡 MÉDIA | Dashboard |
| `GET /dashboard/recent-orders` | 🟡 MÉDIA | Dashboard |
| `GET /settings` | 🔴 ALTA | Settings |
| `PATCH /settings/*` | 🔴 ALTA | Settings |
| `GET /alerts` | 🟡 MÉDIA | Header, Dashboard |
| `PATCH /alerts/:id/read` | 🟡 MÉDIA | Header |
| `GET /reports/*` | 🟢 BAIXA | Reports |
| `POST /reports/export` | 🟢 BAIXA | Reports |
| `GET /health` | 🟢 BAIXA | System Status |

---

**Versão:** 1.0.0 | **Criado:** 13/01/2026
