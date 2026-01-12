# GastroBI - Admin Restaurante Project

## 📋 Visão Geral

Este é o projeto **Admin Restaurante** do GastroBI. Um ambiente completo para donos e gerentes de restaurantes gerenciarem suas operações.

**Branch:** `admin-restaurante`  
**Roles:** `owner` ou `manager`  
**Acesso:** Credenciais do restaurante

---

## 🎯 Funcionalidades (9 Módulos)

### 1. **Dashboard** (`/dashboard`)
- Visão geral do restaurante
- Métricas de vendas e clientes
- Alertas e notificações
- Pedidos recentes

### 2. **Clientes** (`/customers`)
- Cadastro de clientes
- Histórico de compras
- Perfil do cliente
- Segmentação

### 3. **Fidelidade** (`/loyalty`)
- Programa de pontos
- Níveis (Bronze, Silver, Gold)
- Resgate de recompensas
- Configurações do programa

### 4. **Campanhas** (`/campaigns`)
- Campanhas de marketing
- Email marketing
- SMS e WhatsApp
- Promoções e descontos

### 5. **Cardápio Digital** (`/menu`)
- Gestão de categorias
- Produtos e preços
- Imagens e descrições
- Disponibilidade

### 6. **QR Codes** (`/qr-codes`)
- Geração de QR Codes
- QR para mesa
- QR para delivery
- Personalização

### 7. **POS - Frente de Caixa** (`/pos`)
- Sistema de ponto de venda
- Módulos: Mesa, Balcão, Delivery, Comanda, Cozinha
- Pagamentos
- Controle de caixa

### 8. **Relatórios** (`/reports`)
- Relatórios de vendas
- Relatórios de clientes
- Relatórios financeiros
- Exportação (PDF, Excel)

### 9. **Configurações** (`/settings`)
- Dados do restaurante
- Integrações
- Usuários e permissões
- Notificações

---

## 🏗️ Estrutura de Pastas

```
gastrobi/
├── app/
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard principal
│   ├── customers/
│   │   ├── page.tsx           # Lista de clientes
│   │   └── [id]/
│   │       └── page.tsx       # Detalhe do cliente
│   ├── loyalty/
│   │   └── page.tsx           # Programa de fidelidade
│   ├── campaigns/
│   │   └── page.tsx           # Campanhas de marketing
│   ├── menu/
│   │   ├── page.tsx           # Cardápio digital (admin)
│   │   └── [slug]/
│   │       └── page.tsx       # Cardápio público
│   ├── qr-codes/
│   │   └── page.tsx           # Gestão de QR Codes
│   ├── pos/
│   │   └── page.tsx           # POS - Frente de Caixa
│   ├── reports/
│   │   └── page.tsx           # Relatórios
│   ├── settings/
│   │   └── page.tsx           # Configurações
│   └── login/
│       └── page.tsx           # Login
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx        # Menu lateral (9 itens)
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── POS/                   # Módulos do POS
│   │   ├── MesaModule.tsx
│   │   ├── BalcaoModule.tsx
│   │   ├── DeliveryModule.tsx
│   │   ├── ComandaModule.tsx
│   │   └── KitchenModule.tsx
│   ├── WhiteLabel/
│   └── ui/
├── contexts/
│   ├── AuthContext.tsx        # Autenticação
│   ├── WhiteLabelContext.tsx  # Configurações visuais
│   ├── MenuContext.tsx        # Cardápio
│   ├── POSContext.tsx         # Sistema POS
│   └── DataContext.tsx        # Dados gerais
├── config/
│   └── admin-restaurante.config.ts  # Configurações
└── public/
```

---

## 🔐 Autenticação

**Roles disponíveis:**
- `owner` - Dono do restaurante (acesso total)
- `manager` - Gerente (acesso configurável)
- `staff` - Funcionário (acesso limitado)

**Credenciais de exemplo:**
```
Email:    restaurante@email.com
Senha:    [definida pelo usuário]
```

**Suporte a múltiplos restaurantes:**
- Um usuário pode ter vários restaurantes
- `restaurants: Restaurant[]` no AuthContext
- Troca de restaurante via `switchRestaurant()`

---

## 🎨 Identidade Visual

A identidade visual é herdada do [WhiteLabelContext](/contexts/WhiteLabelContext.tsx):

```tsx
// Cores são aplicadas automaticamente pelo contexto
const { config } = useWhiteLabel();

config.primaryColor;    // Cor principal
config.secondaryColor;  // Cor secundária
config.brandName;       // Nome do restaurante
config.logo;            // Logo do restaurante
```

---

## 🚀 Como Iniciar

### 1. Confirmar que está na branch `admin-restaurante`
```bash
git checkout admin-restaurante
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

### 4. Acessar
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard

---

## 📄 Sidebar (Menu Lateral)

A [Sidebar.tsx](/components/Layout/Sidebar.tsx) contém os 9 itens do restaurante:

```tsx
const restauranteNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Fidelidade', href: '/loyalty', icon: Gift },
  { name: 'Campanhas', href: '/campaigns', icon: Megaphone },
  { name: 'Cardápio Digital', href: '/menu', icon: MenuIcon },
  { name: 'QR Codes', href: '/qr-codes', icon: QrCode },
  { name: 'POS - Frente de Caixa', href: '/pos', icon: Calculator },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Configurações', href: '/settings', icon: Settings },
];
```

---

## 📊 Módulos do POS

O sistema POS tem 5 módulos integrados:

| Módulo | Arquivo | Descrição |
|--------|---------|-----------|
| Mesa | `MesaModule.tsx` | Atendimento em mesas |
| Balcão | `BalcaoModule.tsx` | Atendimento no balcão |
| Delivery | `DeliveryModule.tsx` | Pedidos para entrega |
| Comanda | `ComandaModule.tsx` | Sistema de comandas |
| Cozinha | `KitchenModule.tsx` | Painel da cozinha |

---

## 🔄 Contextos Utilizados

| Contexto | Arquivo | Uso |
|----------|---------|-----|
| AuthContext | `contexts/AuthContext.tsx` | Autenticação e usuário |
| WhiteLabelContext | `contexts/WhiteLabelContext.tsx` | Branding e cores |
| MenuContext | `contexts/MenuContext.tsx` | Dados do cardápio |
| POSContext | `contexts/POSContext.tsx` | Estado do POS |
| DataContext | `contexts/DataContext.tsx` | Dados gerais |

---

## 📈 Features por Role

| Feature | Owner | Manager | Staff |
|---------|-------|---------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| Clientes | ✅ | ✅ | 👁️ |
| Fidelidade | ✅ | ✅ | 👁️ |
| Campanhas | ✅ | ✅ | ❌ |
| Cardápio Digital | ✅ | ✅ | 👁️ |
| QR Codes | ✅ | ✅ | ❌ |
| POS | ✅ | ✅ | ✅ |
| Relatórios | ✅ | ✅ | ❌ |
| Configurações | ✅ | ⚙️ | ❌ |

- ✅ Acesso total
- 👁️ Apenas visualização
- ⚙️ Acesso parcial
- ❌ Sem acesso

---

## 🔗 Links Relacionados

- **Branch:** `admin-restaurante`
- **GitHub:** https://github.com/caio-caa/gastrobi/tree/admin-restaurante
- **Admin SaaS:** `admin-saas` (Super admin)
- **Front Customer:** `front-customer` (A criar)

---

## 📧 Suporte

Para dúvidas sobre estrutura, contactar: dev-team

---

*Documentação criada em: 12/01/2026*
