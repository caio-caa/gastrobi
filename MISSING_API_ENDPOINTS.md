## 8. Listar Restaurantes Públicos

### GET `/restaurants/public`

Lista todos os restaurantes públicos disponíveis para clientes.

**Query Params (opcionais):**
- `search` - Buscar por nome ou tipo de cozinha
- `cuisine` - Filtrar por tipo de cozinha
- `isOpen` - Filtrar por status (true/false)
- `page` - Página (default: 1)
- `limit` - Itens por página (default: 20)

**Response (200):**
```json
{
  "restaurants": [
    {
      "id": "uuid-1",
      "slug": "restaurante-do-joao",
      "name": "Restaurante do João",
      "description": "Comida caseira com sabor de vó",
      "image": "https://cdn.example.com/restaurant-1.jpg",
      "rating": 4.8,
      "reviews": 245,
      "cuisine": "Brasileira",
      "deliveryTime": "30-45 min",
      "isOpen": true
    },
    {
      "id": "uuid-2",
      "slug": "pizzaria-express",
      "name": "Pizzaria Express",
      "description": "As melhores pizzas da cidade",
      "image": "https://cdn.example.com/restaurant-2.jpg",
      "rating": 4.5,
      "reviews": 189,
      "cuisine": "Italiana",
      "deliveryTime": "40-55 min",
      "isOpen": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

**Response (200 - Nenhum restaurante):**
```json
{
  "restaurants": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

---