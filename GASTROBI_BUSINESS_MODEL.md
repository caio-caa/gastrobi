# 🍽️ Modelo de Negócio GastroBI - Frontend Implementation

## 📌 Visão Geral

O MVP da GastroBI adota um modelo inteligente que **separa completamente** o consumo no salão dos pedidos online, garantindo:
- ✅ Simplicidade operacional
- ✅ Maior confiança dos restaurantes
- ✅ Redução de erros operacionais
- ✅ Controle total sobre a experiência do cliente

---

## 🔄 Três Fluxos Operacionais

### 1️⃣ **Consumo no Salão (Atendimento em Mesas)**

#### ❌ O que NÃO fazer:
- ❌ QR Code NÃO permite fazer pedidos diretamente
- ❌ Não há botão "Adicionar ao Carrinho" no cardápio
- ❌ Cliente não pode finalizar pedido sozinho

#### ✅ O que FAZER:
- ✅ QR Code é **apenas informativo**
- ✅ Cliente visualiza: Cardápio, preços, descrições, imagens
- ✅ Garçom faz o pedido via: Celular, Tablet ou PDV Web
- ✅ Fluxo tradicional preservado (garçom → cozinha)

#### Frontend Implementation:
```
URL: /menu/[slug]?mode=info (ou similar)
Características:
- Botões de ação DESABILITADOS ou OCULTOS
- Apenas visualização de produtos
- Sem carrinho
- Sem checkout
- Badge: "Peça com o garçom"
```

**Componentes Necessários:**
- `components/Menu/ProductCardInfo.tsx` - Card sem botões de ação
- `components/Menu/InfoBadge.tsx` - Badge informativa

---

### 2️⃣ **Delivery e Retirada no Balcão**

#### ✅ Fluxo Completo:
1. Restaurante compartilha **link público de pedidos** via:
   - WhatsApp
   - Redes Sociais
   - QR Code (diferente do QR de mesa)

2. Cliente acessa a página:
   - Visualiza cardápio completo
   - Adiciona produtos ao carrinho
   - Seleciona tipo de pedido (Delivery/Retirada)

3. Escolhe forma de entrega:
   - 🏍️ **Delivery**: Informe endereço
   - 📦 **Retirada**: Escolha horário

4. Pagamento:
   - 💳 Pix
   - 💰 Cartão de Crédito
   - Integração com sistema da GastroBI

#### Frontend Implementation:
```
URL: /menu/[slug]?mode=order (ou /order/[slug])
Características:
- Carrinho completo
- Seletor de tipo de pedido (Delivery/Retirada)
- Formulário de endereço (Delivery)
- Formulário de horário (Retirada)
- Método de pagamento
- Cupom de desconto
- Gorjeta (opcional)
```

**Componentes Necessários:**
- `components/Order/OrderTypeSelector.tsx`
- `components/Order/AddressForm.tsx`
- `components/Order/TimeSelector.tsx`
- `components/Order/PaymentMethod.tsx`
- `components/Cart/CartDrawer.tsx`
- `components/Checkout/CheckoutSummary.tsx`

---

## 🎯 Páginas Frontend Necessárias

### **Home / Busca de Restaurantes** 
- URL: `/`
- Listagem de restaurantes públicos
- Busca por nome, localização
- Filtros (tipo de cozinha, avaliação)

### **Cardápio Público - Modo Informativo (Mesas)**
- URL: `/menu/[slug]?mode=info`
- Visualização apenas
- Badge: "Peça com nosso garçom"
- Sem ações interativas

### **Cardápio Público - Modo Pedido (Delivery/Retirada)**
- URL: `/order/[slug]` ou `/menu/[slug]?mode=order`
- Carrinho completo
- Checkout integrado
- Formas de entrega
- Pagamento online

### **Rastreamento de Pedido (Opcional para MVP)**
- URL: `/orders/[id]`
- Status em tempo real
- Tempo estimado
- Notificações

---

## 🔌 Endpoints Backend Necessários

### ✅ Já Implementados (provavelmente):
- `GET /restaurants/public` - Lista restaurantes
- `GET /restaurants/[slug]` - Detalhes do restaurante
- `GET /restaurants/[slug]/menu` - Cardápio público

### ⚠️ Necessários para Implementar:
- `POST /orders` - Criar pedido (Delivery/Retirada)
- `GET /orders/[id]` - Rastreamento do pedido
- `POST /payments` - Processar pagamento (Pix/Cartão)
- `GET /restaurants/[slug]/settings` - Configurações (horário de funcionamento, taxa de entrega, etc)
- `GET /customers/[email]` - Histórico de cliente (para próximos pedidos)

### 🔐 Campos Necessários no Pedido:
```typescript
interface Order {
  id: string;
  restaurantId: string;
  type: 'DELIVERY' | 'TAKEAWAY'; // NÃO há 'TABLE'
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery?: {
    address: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    zipCode: string;
  };
  takeaway?: {
    estimatedTime: Date;
  };
  payment: {
    method: 'PIX' | 'CARD';
    status: 'PENDING' | 'PAID' | 'FAILED';
    amount: number;
  };
  discount?: {
    coupon?: string;
    amount: number;
  };
  tip?: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  createdAt: Date;
  estimatedDeliveryTime?: Date;
}
```

---

## 🎨 UI/UX Considerations

### Modo Informativo (Mesas):
```
┌─────────────────────────────────┐
│  🍽️ Restaurante XYZ             │
│  Visualização do Cardápio       │
├─────────────────────────────────┤
│ 🔵 Peça com nosso garçom        │
├─────────────────────────────────┤
│ [Produto 1]                     │
│ Preço: R$ 25,00                 │
│ Descrição...                    │
│ [Fotos]                         │
│                                 │
│ ❌ Adicionar ao Carrinho        │
│    (desabilitado ou oculto)     │
└─────────────────────────────────┘
```

### Modo Pedido (Delivery/Retirada):
```
┌─────────────────────────────────┐
│  🍽️ Restaurante XYZ             │
│  Faça seu Pedido                │
├─────────────────────────────────┤
│ [🏍️ Delivery] [📦 Retirada]     │
├─────────────────────────────────┤
│ [Produto 1]                     │
│ Preço: R$ 25,00                 │
│ Descrição...                    │
│ [Fotos]                         │
│                                 │
│ ✅ Adicionar ao Carrinho        │
│    Quantidade: [+] 1 [-]        │
├─────────────────────────────────┤
│ 🛒 Carrinho (3 itens)           │
│ Subtotal: R$ 75,00              │
│ Taxa Entrega: R$ 5,00           │
│ Total: R$ 80,00                 │
│                                 │
│ [Finalizar Pedido]              │
└─────────────────────────────────┘
```

---

## 📱 Fluxo do Usuário - Delivery

```
1. Cliente clica no link/QR Code
   ↓
2. Acessa /order/[slug]
   ↓
3. Seleciona "Delivery"
   ↓
4. Adiciona produtos ao carrinho
   ↓
5. Clica "Finalizar Pedido"
   ↓
6. Preenche dados:
   - Nome, Email, Telefone
   - Endereço completo
   - Escolhe pagamento (Pix/Cartão)
   ↓
7. Aplica cupom (opcional)
   ↓
8. Adiciona gorjeta (opcional)
   ↓
9. Confirma pedido
   ↓
10. Redireciona para pagamento (Stripe/MercadoPago)
    ↓
11. Após confirmação do pagamento
    ↓
12. Redireciona para /orders/[id] (rastreamento)
    ↓
13. Cliente vê status em tempo real
```

---

## 📋 Checklist de Implementação

### Frontend - Já Existe:
- ✅ Home com lista de restaurantes
- ✅ Cardápio público

### Frontend - Necessário:
- [ ] Modo Informativo (Mesas) - ProductCardInfo
- [ ] Modo Pedido (Delivery/Retirada) - OrderTypeSelector
- [ ] Carrinho de Compras - CartContext + CartDrawer
- [ ] Formulário de Endereço - AddressForm
- [ ] Seletor de Horário - TimeSelector
- [ ] Método de Pagamento - PaymentMethod
- [ ] Página de Rastreamento - OrderTracking
- [ ] Integração com Pix/Cartão - (falta backend?)

### Backend - Necessário:
- [ ] POST /orders - Criar pedido
- [ ] GET /orders/[id] - Rastreamento
- [ ] POST /payments - Processar pagamento
- [ ] GET /restaurants/[slug]/settings - Configurações
- [ ] WebSocket para atualizações em tempo real (opcional)

---

## 🚀 Próximos Passos

1. **Implementar frontend das páginas faltantes**
2. **Criar componentes do carrinho e checkout**
3. **Integrar com backend (pedidos e pagamentos)**
4. **Testes de fluxo completo**
5. **Deploy em produção**

---

**Observação:** Se faltar algo no backend (APIs, campos, etc), avise que será adicionado! 🎯
