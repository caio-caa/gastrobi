# GastroBI - Front Customer Project

## 📋 Visão Geral

Este é o projeto **Front Customer** do GastroBI. Uma interface pública para clientes fazerem pedidos através do cardápio digital.

**Branch:** `front-customer`  
**Acesso:** Público (sem login obrigatório)  
**URL:** `/menu/[slug-do-restaurante]`

---

## 🎯 Funcionalidades

### 1. **Cardápio Digital** (`/menu/[slug]`)
- Visualização do cardápio completo
- Categorias e filtros
- Busca de produtos
- Detalhes do produto
- Extras e observações

### 2. **Carrinho de Compras**
- Adicionar/remover itens
- Alterar quantidades
- Aplicar cupons de desconto
- Calcular taxa de entrega
- Persistência em localStorage

### 3. **Tipos de Pedido**
- 🏠 **Comer no local** - Informe o número da mesa
- 🏍️ **Delivery** - Informe o endereço de entrega
- 📦 **Retirada** - Escolha horário de retirada

### 4. **Checkout**
- Dados do cliente (nome, telefone)
- Endereço de entrega (se delivery)
- Forma de pagamento
- Cupom de desconto
- Gorjeta (opcional)

### 5. **Fidelidade** (Opcional)
- Ver pontos acumulados
- Níveis: Bronze, Silver, Gold
- Trocar pontos por descontos

### 6. **Rastreamento de Pedido**
- Status em tempo real
- Tempo estimado
- Notificações

---

## 🏗️ Estrutura de Pastas

```
gastrobi/
├── app/
│   ├── menu/
│   │   └── [slug]/
│   │       └── page.tsx       # Cardápio público
│   ├── cart/
│   │   └── page.tsx           # Carrinho (se separado)
│   ├── checkout/
│   │   └── page.tsx           # Finalização do pedido
│   ├── orders/
│   │   ├── page.tsx           # Lista de pedidos
│   │   └── [id]/
│   │       └── page.tsx       # Rastreamento do pedido
│   └── login/
│       └── page.tsx           # Login opcional
├── components/
│   ├── Layout/
│   │   └── CustomerLayout.tsx  # Layout SEM sidebar
│   ├── Cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   ├── Checkout/
│   │   ├── AddressForm.tsx
│   │   ├── PaymentMethod.tsx
│   │   └── OrderSummary.tsx
│   ├── Menu/
│   │   ├── ProductCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── ProductModal.tsx
│   └── ui/
├── contexts/
│   ├── CartContext.tsx         # Carrinho de compras
│   ├── WhiteLabelContext.tsx   # Branding do restaurante
│   └── MenuContext.tsx         # Dados do cardápio
├── config/
│   └── front-customer.config.ts
└── public/
```

---

## 🎨 Layout

### Sem Sidebar
O Front Customer usa um layout simplificado **SEM sidebar**:

```tsx
// components/Layout/CustomerLayout.tsx

<div className="min-h-screen bg-gray-50 flex flex-col">
  {/* Header Simples */}
  <header>
    <Logo /> | <RestaurantName /> | <CartIcon />
  </header>

  {/* Content */}
  <main>{children}</main>

  {/* Footer */}
  <footer>Powered by GastroBI</footer>
</div>
```

### Navegação Simples
- Logo do restaurante (volta ao cardápio)
- Ícone do carrinho com contador
- Sem menu lateral

---

## 🛒 Carrinho de Compras

O [CartContext](/contexts/CartContext.tsx) gerencia todo o estado do carrinho:

```tsx
const { 
  items,           // Itens no carrinho
  addItem,         // Adicionar item
  removeItem,      // Remover item
  itemsCount,      // Total de itens
  subtotal,        // Subtotal
  deliveryFee,     // Taxa de entrega
  discount,        // Desconto (cupom)
  total,           // Total final
  applyCoupon,     // Aplicar cupom
} = useCart();
```

### Persistência
O carrinho é salvo automaticamente no `localStorage`:
- Sobrevive ao refresh da página
- Mantém itens entre sessões
- Key: `gastrobi_cart`

---

## 🚀 Como Iniciar

### 1. Confirmar que está na branch `front-customer`
```bash
git checkout front-customer
git branch
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Rodar desenvolvimento
```bash
npm run dev
```

### 4. Acessar cardápio
```
http://localhost:3000/menu/restaurante-do-joao
```

---

## 📱 Fluxo do Usuário

```
┌──────────────────┐
│   Welcome Screen │  "Olá! Bem-vindo ao [Restaurante]"
│   - Mesa         │  Escolha: Comer aqui ou Delivery?
│   - Delivery     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Location Screen │  
│   Mesa: "Qual sua mesa?"
│   Delivery: "Seu endereço"
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Menu Screen    │  Cardápio com categorias
│   - Categorias   │  Busca, filtros
│   - Produtos     │  Adicionar ao carrinho
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Cart Screen    │  Revisar pedido
│   - Itens        │  Cupom de desconto
│   - Totais       │  Finalizar
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Checkout       │  Dados do cliente
│   - Nome/Tel     │  Pagamento
│   - Pagamento    │  Confirmar
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Order Tracking │  Acompanhar pedido
│   - Status       │  Tempo estimado
│   - Mapa         │  Notificações
└──────────────────┘
```

---

## 💳 Formas de Pagamento

| Método | Ícone | Status |
|--------|-------|--------|
| PIX | QrCode | ✅ Ativo |
| Cartão de Crédito | CreditCard | ✅ Ativo |
| Cartão de Débito | CreditCard | ✅ Ativo |
| Dinheiro | Banknote | ✅ Ativo |

---

## 🎁 Cupons de Desconto

Cupons disponíveis para teste:

| Código | Desconto |
|--------|----------|
| `PRIMEIRA10` | 10% |
| `DESCONTO15` | 15% |
| `PROMO20` | 20% |

---

## 🔄 Contextos Utilizados

| Contexto | Arquivo | Uso |
|----------|---------|-----|
| CartContext | `contexts/CartContext.tsx` | Carrinho de compras |
| WhiteLabelContext | `contexts/WhiteLabelContext.tsx` | Branding do restaurante |
| MenuContext | `contexts/MenuContext.tsx` | Dados do cardápio |

---

## 📊 Comparação com Outros Projetos

| Feature | Admin SaaS | Admin Restaurante | Front Customer |
|---------|-----------|------------------|----------------|
| Sidebar | ✅ 3 itens | ✅ 9 itens | ❌ Sem sidebar |
| Login | ✅ Obrigatório | ✅ Obrigatório | ⚙️ Opcional |
| Cardápio | ❌ | ✅ Gestão | ✅ Visualização |
| Carrinho | ❌ | ❌ | ✅ |
| Checkout | ❌ | ❌ | ✅ |
| POS | ❌ | ✅ | ❌ |

---

## 🔗 Links Relacionados

- **Branch:** `front-customer`
- **GitHub:** https://github.com/caio-caa/gastrobi/tree/front-customer
- **Admin SaaS:** `admin-saas`
- **Admin Restaurante:** `admin-restaurante`

---

## 📧 Suporte

Para dúvidas sobre estrutura, contactar: dev-team

---

*Documentação criada em: 12/01/2026*
