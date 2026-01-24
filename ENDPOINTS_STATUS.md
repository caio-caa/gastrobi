# 📊 Status dos Endpoints - GastroBI

**Data:** 24 de Janeiro de 2026  
**Branch:** front-customer

---

## ✅ ENDPOINTS IMPLEMENTADOS (Backend & Frontend)

### Public Menu API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/menu/:slug` | GET | ✅ | Obter cardápio público |
| `/menu/:slug/product/:productId` | GET | ✅ | Obter detalhes do produto |
| `/menu/:slug/order` | POST | ✅ | Criar pedido público |

### Coupon API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/menu/:slug/coupon/validate` | POST | ✅ | Validar código de cupom |

**Request:**
```json
{
  "code": "DESCONTO10",
  "subtotal": 150.00,
  "customerId": "optional-uuid"
}
```

**Response:**
```json
{
  "valid": true,
  "code": "DESCONTO10",
  "discountType": "percentage",
  "discountValue": 10,
  "calculatedDiscount": 15.00,
  "minOrderValue": 50.00,
  "expiresAt": "2026-02-28T00:00:00.000Z"
}
```

### Delivery API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/menu/:slug/delivery/calculate` | POST | ✅ | Calcular taxa de entrega |

**Request:**
```json
{
  "zipCode": "01234567"
}
```

**Response:**
```json
{
  "available": true,
  "fee": 8.00,
  "estimatedTime": 45,
  "freeDeliveryMinimum": 100.00,
  "message": null
}
```

### Restaurant Info API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/menu/:slug/info` | GET | ✅ | Obter informações do restaurante |

**Response:**
```json
{
  "id": "uuid",
  "name": "Restaurant Name",
  "slug": "restaurant-slug",
  "description": "Descrição do restaurante",
  "phone": "+5511999999999",
  "address": {
    "street": "Rua Example",
    "number": "123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234567"
  },
  "openingHours": [
    {
      "dayOfWeek": 1,
      "openTime": "11:00",
      "closeTime": "23:00",
      "isOpen": true
    }
  ],
  "isOpen": true,
  "minimumOrderValue": 30.00,
  "deliveryTime": {
    "min": 30,
    "max": 60
  }
}
```

### Health Check API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/health` | GET | ✅ | Verificar status da API |

---

## 📋 RESUMO

### Backend
- ✅ **6 endpoints prontos:**
  - GET `/menu/:slug` - Cardápio público
  - GET `/menu/:slug/product/:productId` - Detalhes do produto
  - POST `/menu/:slug/order` - Criar pedido
  - POST `/menu/:slug/coupon/validate` - Validar cupons
  - POST `/menu/:slug/delivery/calculate` - Taxa de entrega
  - GET `/menu/:slug/info` - Info do restaurante

### Frontend (lib/api.ts)
- ✅ **6 endpoints implementados** (publicMenuApi, couponApi, deliveryApi, restaurantApi)
- ✅ **1 endpoint health check**

---

## 🚀 STATUS: TUDO PRONTO!

Todos os endpoints do modelo de negócio da GastroBI estão implementados:
- ✅ Cardápio Digital com informações
- ✅ Validação de Cupons/Descontos
- ✅ Cálculo de Taxa de Entrega
- ✅ Informações do Restaurante

---

## 📝 Notas
- Todos os endpoints públicos NÃO requerem autenticação
- Base URL: `http://localhost:3001/api/v1`
- Formato de resposta: JSON
- Requisições usando `Content-Type: application/json`
