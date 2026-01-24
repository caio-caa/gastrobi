# 🔗 Guia de Integração - Frontend + Backend

## 📱 Página Completa de Pedido - Exemplo de Uso

```tsx
// app/order/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import OrderTypeSelector from '@/components/Order/OrderTypeSelector';
import AddressForm, { Address } from '@/components/Order/AddressForm';
import TimeSelector from '@/components/Order/TimeSelector';
import PaymentMethod from '@/components/Order/PaymentMethod';
import CheckoutSummary from '@/components/Order/CheckoutSummary';

interface OrderData {
  restaurantId: string;
  type: 'DELIVERY' | 'TAKEAWAY';
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery?: Address;
  takeaway?: {
    estimatedTime: string;
  };
  payment: {
    method: 'PIX' | 'CARD';
    amount: number;
  };
  discount?: number;
  tip?: number;
}

export default function OrderPage({ params }: { params: { slug: string } }) {
  const [orderType, setOrderType] = useState<'DELIVERY' | 'TAKEAWAY'>('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARD'>('PIX');
  const [address, setAddress] = useState<Address | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const cartItems = [
    // Virá do CartContext
  ];
  const subtotal = 75.00;
  const deliveryFee = orderType === 'DELIVERY' ? 5.00 : 0;
  const tip = 2.50;
  const discount = 5.00;

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    const orderData = {
      restaurantId: 'rest_123',
      type: orderType,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      customer: customerData,
      delivery: orderType === 'DELIVERY' ? address : undefined,
      takeaway: orderType === 'TAKEAWAY' ? { estimatedTime: pickupTime } : undefined,
      payment: {
        method: paymentMethod,
        amount: subtotal + deliveryFee - discount + tip
      },
      discount: { amount: discount },
      tip: tip
    };

    try {
      // 1️⃣ Criar pedido
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const order = await orderResponse.json();

      if (!order.id) throw new Error('Erro ao criar pedido');

      // 2️⃣ Processar pagamento
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          method: paymentMethod,
          amount: orderData.payment.amount,
          cardToken: paymentMethod === 'CARD' ? 'tok_123' : undefined
        })
      });

      const payment = await paymentResponse.json();

      // 3️⃣ Redirecionar para pagamento ou rastreamento
      if (paymentMethod === 'PIX') {
        // Mostrar QR Code do Pix
        router.push(`/orders/${order.id}?pix=${payment.pixQrCode}`);
      } else {
        // Redirecionar para gateway de cartão ou rastreamento
        router.push(`/orders/${order.id}`);
      }

    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Faça seu Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Tipo de Pedido */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Como você deseja receber?</h2>
            <OrderTypeSelector value={orderType} onChange={setOrderType} />
          </section>

          {/* 2. Dados do Cliente */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Seus Dados</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Seu Nome"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="seu@email.com"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                placeholder="+55 11 9876-5432"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </section>

          {/* 3. Endereço ou Horário */}
          {orderType === 'DELIVERY' ? (
            <section>
              <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
              <AddressForm onSubmit={setAddress} />
            </section>
          ) : (
            <section>
              <h2 className="text-xl font-semibold mb-4">Horário de Retirada</h2>
              <TimeSelector onSubmit={setPickupTime} />
            </section>
          )}

          {/* 4. Método de Pagamento */}
          <section>
            <PaymentMethod 
              value={paymentMethod}
              onChange={setPaymentMethod}
              total={subtotal + deliveryFee - discount + tip}
            />
          </section>

        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            items={cartItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discount={discount}
            tip={tip}
            onUpdateQuantity={(id, qty) => console.log('Atualizar quantidade')}
            onRemoveItem={(id) => console.log('Remover item')}
          />

          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg"
          >
            {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                     PÁGINA DE PEDIDO                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ OrderTypeSelector                                      │ │
│  │ ↓ Estado: orderType = 'DELIVERY' | 'TAKEAWAY'        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Dados do Cliente                                       │ │
│  │ ↓ Estado: customerData = { name, email, phone }      │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ AddressForm (se DELIVERY)                            │ │
│  │ ↓ Estado: address = { rua, número, bairro... }      │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ TimeSelector (se TAKEAWAY)                           │ │
│  │ ↓ Estado: pickupTime = '18:30'                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ PaymentMethod                                          │ │
│  │ ↓ Estado: paymentMethod = 'PIX' | 'CARD'            │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│              [handleSubmitOrder]                             │
│                          ↓                                   │
│              ┌───────────────────────┐                       │
│              │ POST /api/orders      │                       │
│              └───────────────────────┘                       │
│                          ↓                                   │
│              Recebe: order.id, payment.id                    │
│                          ↓                                   │
│              ┌───────────────────────┐                       │
│              │ POST /api/payments    │                       │
│              └───────────────────────┘                       │
│                          ↓                                   │
│              Recebe: payment.pixQrCode (ou confirma)        │
│                          ↓                                   │
│              [Router.push(/orders/[id])]                    │
│                          ↓                                   │
│              Página de Rastreamento/Pix                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Segurança e Validação

### Frontend:
```tsx
// Validações antes de enviar
✅ Nome preenchido
✅ Email válido
✅ Telefone preenchido
✅ Endereço completo (se Delivery)
✅ Horário selecionado (se Takeaway)
✅ Pelo menos 1 item no carrinho
```

### Backend (⚠️ IMPLEMENTAR):
```typescript
// Validações no servidor
✅ Verificar se restaurante existe e está aberto
✅ Validar CEP com Google Maps API ou similar
✅ Calcular taxa de entrega com base no bairro
✅ Verificar cupom de desconto
✅ Validar método de pagamento
✅ Criar pedido no banco
✅ Processar pagamento com gateway
✅ Notificar cozinha (WhatsApp/Email)
✅ Notificar cliente (WhatsApp/Email)
```

---

## 📦 Dados que Serão Salvos no Banco

### Order (Pedido)
```json
{
  "id": "ord_789",
  "restaurantId": "rest_123",
  "type": "DELIVERY",
  "status": "PENDING",
  "customerName": "João Silva",
  "customerEmail": "joao@example.com",
  "customerPhone": "+55 11 98765-4321",
  "deliveryAddress": "Rua das Flores, 123, Apto 42, Centro, São Paulo, 01234-567",
  "subtotal": 75.00,
  "deliveryFee": 5.00,
  "discount": 5.00,
  "tip": 2.50,
  "total": 77.50,
  "paymentMethod": "PIX",
  "paymentStatus": "PENDING",
  "createdAt": "2025-01-24T18:00:00Z"
}
```

### Payment (Pagamento)
```json
{
  "id": "pay_123",
  "orderId": "ord_789",
  "method": "PIX",
  "status": "PENDING",
  "amount": 77.50,
  "pixQrCode": "00020126360014br.gov.bcb.pix...",
  "pixExpiration": "2025-01-24T18:30:00Z",
  "createdAt": "2025-01-24T18:00:00Z"
}
```

---

## ✨ Próximos Passos

1. **Backend** ⏳
   - Criar as APIs listadas em `BACKEND_APIS_NEEDED.md`
   - Integrar com gateways de pagamento
   - Configurar notificações

2. **Frontend** (após backend pronto)
   - Criar página `/order/[slug]`
   - Integrar com CartContext
   - Testar fluxo completo
   - Adicionar página de rastreamento

3. **Testes** 🧪
   - Teste unitário dos componentes
   - Teste E2E do fluxo completo
   - Teste de pagamento (sandbox)

---

**Componentes estão prontos! Aguardando backend.** 🚀
