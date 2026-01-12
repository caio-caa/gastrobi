# 🏗️ GastroBI - Arquitetura de 3 Projetos

## Visão Geral da Separação

A aplicação GastroBI será dividida em **3 projetos independentes**, mantendo a **mesma identidade visual** e contextos compartilhados:

```
┌─────────────────────────────────────────────────────────────────┐
│                     GastroBI Core Repository                     │
│                     (Main branch = monorepo)                     │
└─────────────────────────────────────────────────────────────────┘
          ↓
    ┌─────┴─────┬──────────────┐
    ↓           ↓              ↓
┌──────────┐ ┌──────────┐ ┌─────────────┐
│ Admin    │ │  Admin   │ │  Front      │
│ SaaS     │ │Restaur.  │ │  Customer   │
│ Project  │ │ Project  │ │  Project    │
└──────────┘ └──────────┘ └─────────────┘
    ✓           ✓              ✓
 Branch:     Branch:        Branch:
admin-saas   admin-resto    front-customer
   -new        -new           -new
```

---

## 📊 Comparação dos 3 Projetos

| Aspecto | Admin SaaS | Admin Restaurante | Front Customer |
|---------|-----------|------------------|----------------|
| **Branch Git** | `admin-saas-new` | `admin-resto-new` | `front-customer-new` |
| **Acesso** | Super Admin | Dono/Gerente | Cliente Público |
| **Email** | `admin@gastrobi.com` | Restaurante@email.com | Sem login |
| **Sidebar** | 3 itens (Admin) | 9 itens (Restaurante) | N/A (Sem menu) |
| **Início** | `/admin/users` | `/dashboard` | `/menu/[slug]` |
| **WhiteLabel** | Gerencia | Usa config | Usa config |
| **Tema Cores** | Púrpura/Indigo | Customizável | Customizável |

---

## 1️⃣ **Admin SaaS Project** (✅ IN PROGRESS)

**Branch:** `admin-saas-new`  
**Status:** 🚀 Em desenvolvimento

### Funcionalidades:
- ✅ Gestão de Usuários (CRUD)
- ✅ White Label & Clientes
- ✅ Analytics & Métricas da Plataforma
- ✅ Gerenciar Planos e Permissões
- ✅ Relatórios Globais

### Sidebar:
```
Gestão de Usuários          → /admin/users
White Label & Clientes      → /admin/white-label
Analytics & Métricas        → /admin/analytics
```

### Contextos Utilizados:
- ✅ `AuthContext` - Autenticação super admin
- ✅ `WhiteLabelContext` - Branding principal

### Arquivos Principais:
- [ADMIN_SAAS_README.md](/ADMIN_SAAS_README.md)
- [config/admin-saas.config.ts](/config/admin-saas.config.ts)
- [components/Layout/Sidebar.tsx](/components/Layout/Sidebar.tsx)

---

## 2️⃣ **Admin Restaurante Project** (📋 TODO)

**Branch:** `admin-resto-new` (A criar)  
**Status:** ⏳ Aguardando inicio

### Funcionalidades:
- Gestão de Clientes
- Fidelidade
- Campanhas Marketing
- Cardápio Digital
- QR Codes
- POS - Frente de Caixa
- Relatórios
- Configurações

### Sidebar:
```
Dashboard               → /dashboard
Clientes               → /customers
Fidelidade             → /loyalty
Campanhas              → /campaigns
Cardápio Digital       → /menu
QR Codes               → /qr-codes
POS - Frente de Caixa  → /pos
Relatórios             → /reports
Configurações          → /settings
```

### Contextos Utilizados:
- ✅ `AuthContext` - Autenticação restaurante
- ✅ `WhiteLabelContext` - Branding por cliente
- ✅ `MenuContext` - Cardápio
- ✅ `POSContext` - Sistema de venda

### Arquivos a Criar:
- `ADMIN_RESTAURANTE_README.md`
- `config/admin-resto.config.ts`
- [components/Layout/Sidebar.tsx](/components/Layout/Sidebar.tsx) (adaptado)

---

## 3️⃣ **Front Customer Project** (📋 TODO)

**Branch:** `front-customer-new` (A criar)  
**Status:** ⏳ Aguardando inicio

### Funcionalidades:
- Cardápio Digital Público
- Histórico de Pedidos
- Carrinho de Compras
- Checkout
- Fidelidade (pontos, descontos)
- Rastreamento de Pedido
- Perfil do Cliente

### Sem Sidebar - Navegação Simples:
```
Logo/Home              → Volta ao cardápio
Carrinho               → /cart
Perfil (se logado)     → /profile
Logout                 → /login
```

### Contextos Utilizados:
- ✅ `WhiteLabelContext` - Branding restaurante
- ✅ `MenuContext` - Cardápio
- ✅ Novo: `CartContext` - Carrinho

### Arquivos a Criar:
- `FRONT_CUSTOMER_README.md`
- `config/front-customer.config.ts`
- `components/Layout/CustomerHeader.tsx`

---

## 🎨 Identidade Visual Compartilhada

Todos os 3 projetos usam:

### WhiteLabelContext
```tsx
interface WhiteLabelConfig {
  brandName: string;        // Logo/Nome
  primaryColor: string;     // Cor principal
  secondaryColor: string;   // Cor secundária
  logo: string;             // Imagem logo
  customDomain: string;     // Domínio customizado
  features: FeatureFlags;   // Features ativas
}
```

### Cores Padrão (Podem ser alteradas por cliente):
```
Primária:   #6366f1 (Indigo)
Secundária: #4f46e5 (Indigo-600)
Acentuada:  #10b981 (Verde)
Background: #ffffff (Branco)
Text:       #111827 (Cinza escuro)
```

---

## 🔄 Estrutura Git

### Organização de Branches:

```
main (versão produção - monorepo original)
├── admin-saas-new ✅ (Super admin)
├── admin-resto-new 📋 (Manager/Owner)
├── front-customer-new 📋 (Público)
├── frontend/users (Worktree anterior)
└── noah (Branch antiga)
```

### Comandos Git:

```bash
# Listar todas as branches
git branch -a

# Listar worktrees
git worktree list

# Trocar de branch/worktree
git checkout admin-saas-new

# Ver status
git status
```

---

## 📁 Estrutura de Pastas (Monorepo)

```
gastrobi/
├── app/
│   ├── admin/              # Admin SaaS pages
│   │   ├── users/
│   │   ├── white-label/
│   │   └── analytics/
│   ├── dashboard/          # Admin Restaurante (Será dividido)
│   ├── customers/
│   ├── loyalty/
│   ├── campaigns/
│   ├── menu/               # Front Customer (Será dividido)
│   │   └── [slug]/
│   ├── pos/
│   ├── qr-codes/
│   ├── reports/
│   ├── settings/
│   └── login/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx     # Diferente por projeto
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── POS/
│   ├── WhiteLabel/
│   └── ui/
├── contexts/               # Compartilhados
│   ├── AuthContext.tsx
│   ├── WhiteLabelContext.tsx
│   ├── MenuContext.tsx
│   └── POSContext.tsx
├── config/                 # Config específica por projeto
│   ├── admin-saas.config.ts ✅
│   ├── admin-resto.config.ts 📋
│   └── front-customer.config.ts 📋
├── public/
├── ADMIN_SAAS_README.md ✅
├── ADMIN_RESTAURANTE_README.md 📋
├── FRONT_CUSTOMER_README.md 📋
└── README.md
```

---

## 🚀 Próximos Passos

### Fase 1: Admin SaaS ✅
- [x] Criar branch `admin-saas-new`
- [x] Adaptar Sidebar para apenas admin
- [x] Documentação
- [x] Configurações específicas
- [ ] Testar funcionalidades de admin

### Fase 2: Admin Restaurante 📋
- [ ] Criar branch `admin-resto-new`
- [ ] Adaptar Sidebar com 9 itens
- [ ] Remover páginas admin SaaS
- [ ] Documentação
- [ ] Testar funcionalidades

### Fase 3: Front Customer 📋
- [ ] Criar branch `front-customer-new`
- [ ] Criar Layout sem Sidebar
- [ ] Pagina pública de cardápio
- [ ] Carrinho de compras
- [ ] Documentação
- [ ] Testar fluxo customer

### Fase 4: Sincronização 📋
- [ ] Sincronizar componentes compartilhados
- [ ] Testar WhiteLabel em todos os 3
- [ ] CI/CD pipeline
- [ ] Deploy separado

---

## 🔐 Autenticação por Projeto

```
Admin SaaS:
├── Email: admin@gastrobi.com
└── Senha: 123456

Admin Restaurante:
├── Email: restaurante@email.com
├── Senha: [hash bcrypt]
└── Role: owner/manager

Front Customer:
├── Sem login obrigatório
├── Login opcional (email/telefone)
└── Carrinho persistente (localStorage)
```

---

## 📚 Documentação por Projeto

| Projeto | README |
|---------|--------|
| Admin SaaS | [ADMIN_SAAS_README.md](/ADMIN_SAAS_README.md) |
| Admin Restaurante | `ADMIN_RESTAURANTE_README.md` (TODO) |
| Front Customer | `FRONT_CUSTOMER_README.md` (TODO) |

---

*Documentação criada em: 12/01/2026*  
*Última atualização: 12/01/2026*
