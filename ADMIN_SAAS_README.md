# GastroBI - Admin SaaS Project

## 📋 Visão Geral

Este é o projeto **Admin SaaS** do GastroBI. Um ambiente exclusivo para super admins gerenciarem a plataforma completa.

**Branch:** `admin-saas-new`  
**Email de acesso:** `admin@gastrobi.com`  
**Senha:** `123456`

---

## 🎯 Funcionalidades

### 1. **Gestão de Usuários** (`/admin/users`)
- Visualizar todos os usuários da plataforma
- Gerenciar restaurantes (clientes)
- Controlar planos e permissões
- Gerenciar SaaS (criar, editar, deletar clientes)

### 2. **White Label & Clientes** (`/admin/white-label`)
- Configurar branding personalizado por cliente
- Definir cores, logo, domínio customizado
- Gerenciar features ativas por plano
- Configurar templates e templates emails

### 3. **Analytics & Métricas** (`/admin/analytics`)
- Dashboard com métricas da plataforma
- Visualizar dados de todos os restaurantes
- Relatórios de receita, crescimento
- Monitoramento de performance

---

## 🏗️ Estrutura de Pastas

```
gastrobi/
├── app/
│   ├── admin/
│   │   ├── users/
│   │   │   └── page.tsx         # Gestão de Usuários
│   │   ├── white-label/
│   │   │   └── page.tsx         # Configuração White Label
│   │   └── analytics/
│   │       └── page.tsx         # Analytics & Métricas
│   └── login/
│       └── page.tsx             # Login (apenas super admin)
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx          # Menu lateral (ADMIN SAAS ONLY)
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── WhiteLabel/              # Componentes White Label
│   │   ├── WhiteLabelHeader.tsx
│   │   ├── WhiteLabelButton.tsx
│   │   └── WhiteLabelFooter.tsx
│   └── ui/
├── contexts/
│   ├── AuthContext.tsx          # Autenticação
│   └── WhiteLabelContext.tsx    # Configurações White Label
└── public/
```

---

## 🔐 Autenticação

**Credenciais de Super Admin:**
```
Email:    admin@gastrobi.com
Senha:    123456
```

O arquivo [AuthContext.tsx](/contexts/AuthContext.tsx) valida essas credenciais no login.

---

## 🎨 Identidade Visual

A identidade visual é mantida via [WhiteLabelContext](/contexts/WhiteLabelContext.tsx):

```tsx
const defaultConfig: WhiteLabelConfig = {
  brandName: 'GastroBI',
  primaryColor: '#6366f1',      // Indigo
  secondaryColor: '#4f46e5',
  ...
};
```

**Cores principais:**
- **Primária:** Indigo (#6366f1)
- **Secundária:** Indigo-600 (#4f46e5)
- **Acentuada:** Verde (#10b981)

---

## 🚀 Como Iniciar

### 1. Confirmar que está na branch `admin-saas-new`
```bash
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
- Admin SaaS: http://localhost:3000/admin/users

---

## 📄 Sidebar (Menu Lateral)

A [Sidebar.tsx](/components/Layout/Sidebar.tsx) foi adaptada para mostrar APENAS os itens do Admin SaaS:

```tsx
const adminSaaSNavigation = [
  { name: 'Gestão de Usuários', href: '/admin/users', icon: Users },
  { name: 'White Label & Clientes', href: '/admin/white-label', icon: Palette },
  { name: 'Analytics & Métricas', href: '/admin/analytics', icon: BarChart3 },
];
```

---

## 🔄 Próximos Passos

1. **Admin Restaurante** - Branch separada para gerentes de restaurantes
2. **Front Customer** - Projeto público para clientes fazer pedidos
3. **Sincronização** - Manter identidade visual entre os 3 projetos

---

## 📧 Suporte

Para dúvidas sobre estrutura, contactar: dev-team

---

*Documentação criada em: 12/01/2026*
