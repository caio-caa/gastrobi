# 📊 Status dos Endpoints - GastroBI

**Data:** 24 de Janeiro de 2026  
**Branch:** admin-restaurante

---

## ✅ ENDPOINTS IMPLEMENTADOS (Frontend)

### Public Menu API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/menu/:slug` | GET | ✅ | Obter cardápio público |
| `/menu/:slug/product/:productId` | GET | ✅ | Obter detalhes do produto |
| `/menu/:slug/order` | POST | ✅ | Criar pedido público |

### Health Check API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/health` | GET | ✅ | Verificar status da API |

---

## ⚠️ ENDPOINTS FALTANDO NO BACKEND (Precisa Implementar)

### Coupon API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/menu/:slug/coupon/validate` | POST | ❌ | Validar código de cupom |

**Razão:** Necessário para aplicar descontos nos pedidos

**Request:**
```json
{
  "code": "DESCONTO10",
  "restaurantSlug": "restaurant-name",
  "subtotal": 150.00
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
  "expiresAt": "2026-02-28"
}
```

---

### Delivery API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/menu/:slug/delivery/calculate` | POST | ❌ | Calcular taxa de entrega |

**Razão:** Necessário para validar disponibilidade de entrega por CEP

**Request:**
```json
{
  "zipCode": "01234-567"
}
```

**Response:**
```json
{
  "available": true,
  "fee": 8.00,
  "estimatedTime": 45,
  "freeDeliveryMinimum": 100.00,
  "message": "Entrega disponível"
}
```

---

### Restaurant Info API
| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/menu/:slug/info` | GET | ❌ | Obter informações do restaurante |

**Razão:** Atualmente incluído em `/menu/:slug`, mas pode ser separado

**Response:**
```json
{
  "id": "uuid",
  "name": "Restaurant Name",
  "slug": "restaurant-name",
  "description": "Descrição do restaurante",
  "phone": "+5511999999999",
  "address": {
    "street": "Rua Example",
    "number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
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

---

## 📋 RESUMO

### Frontend (lib/api.ts)
- ✅ **3 endpoints implementados** (publicMenuApi)
- ✅ **1 endpoint health check**
- ⚠️ **3 endpoints preparados** (aguardando backend)

### Backend
- ✅ **3 endpoints prontos** (GET /menu/:slug, GET /menu/:slug/product/:productId, POST /menu/:slug/order)
- ❌ **3 endpoints faltando:**
  - POST `/menu/:slug/coupon/validate` - Validação de cupons
  - POST `/menu/:slug/delivery/calculate` - Cálculo de taxa de entrega
  - GET `/menu/:slug/info` - Informações do restaurante

---

## 🚀 PRÓXIMOS PASSOS

1. **Backend:** Implementar os 3 endpoints faltantes
2. **Frontend:** Quando os endpoints estiverem prontos, descomente os calls em:
   - `couponApi.validate()`
   - `deliveryApi.calculateFee()`
   - `restaurantApi.getInfo()`

---

## 📝 Notas
- Todos os endpoints públicos NÃO requerem autenticação
- Base URL: `http://localhost:3001/api/v1`
- Formato de resposta: JSON
