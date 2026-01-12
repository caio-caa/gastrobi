# Documentação de Termos - GastroBI

## Resumo de Localização de Termos na Aplicação

---

## 1. "Administração"

### Localizações:
| Arquivo | Linha | Forma de Uso |
|---------|-------|--------------|
| `components/Layout/Sidebar.tsx` | L115 | Comentário: `{/* Navegação de administração (apenas para super admin) */}` |
| `components/Layout/Sidebar.tsx` | L122 | Label de seção no menu lateral: `Administração` (texto visível na UI) |

### Contexto:
- Usado como **título de seção** no menu lateral (Sidebar)
- Aparece apenas para usuários com role de **super admin** (`user?.email === 'admin@gastrobi.com'`)
- Agrupa os itens de navegação administrativa: Administração SaaS, White Label e Analytics SaaS

---

## 2. "Administração SaaS"

### Localizações:
| Arquivo | Linha | Forma de Uso |
|---------|-------|--------------|
| `components/Layout/Sidebar.tsx` | L43 | Item de navegação no array `adminNavigation`: `{ name: 'Administração SaaS', href: '/admin/users', icon: Crown }` |
| `app/admin/users/page.tsx` | L382 | Título H1 da página: `<h1 className="text-2xl font-bold text-gray-900">Administração SaaS</h1>` |

### Contexto:
- **Menu Sidebar**: Link de navegação que direciona para `/admin/users`
- **Página de Usuários**: Título principal da página de gestão de usuários SaaS
- Ícone utilizado: `Crown` (coroa) do Lucide React
- Subtítulo: "Painel master para gestão da plataforma"

---

## 3. "White Label"

### Localizações:
| Arquivo | Linha | Forma de Uso |
|---------|-------|--------------|
| `components/Layout/Sidebar.tsx` | L44 | Item de navegação: `{ name: 'White Label', href: '/admin/white-label', icon: Palette }` |
| `app/admin/white-label/page.tsx` | L191 | Título H1: `<h1 className="text-2xl font-bold text-gray-900">Administração White Label</h1>` |

### Componentes Relacionados:
| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `WhiteLabelContext` | `contexts/WhiteLabelContext.tsx` | Context React para configurações de White Label |
| `WhiteLabelHeader` | `components/WhiteLabel/WhiteLabelHeader.tsx` | Header customizável com logo/nome do cliente |
| `WhiteLabelButton` | `components/WhiteLabel/WhiteLabelButton.tsx` | Botão com estilos White Label |
| `WhiteLabelFooter` | `components/WhiteLabel/WhiteLabelFooter.tsx` | Footer customizável |

### Contexto:
- **Menu Sidebar**: Link de navegação que direciona para `/admin/white-label`
- **Página Admin**: Gestão de clientes e configurações da plataforma SaaS
- Ícone utilizado: `Palette` do Lucide React
- Sistema de personalização visual para diferentes clientes (cores, logo, nome)

---

## 4. "Analytics SaaS"

### Localizações:
| Arquivo | Linha | Forma de Uso |
|---------|-------|--------------|
| `components/Layout/Sidebar.tsx` | L45 | Item de navegação: `{ name: 'Analytics SaaS', href: '/admin/analytics', icon: BarChart3 }` |
| `app/admin/analytics/page.tsx` | L72 | Nome da função/componente: `export default function SaaSAnalyticsPage()` |
| `app/admin/analytics/page.tsx` | L211 | Título H1: `<h1 className="text-2xl font-bold text-gray-900">Analytics SaaS</h1>` |

### Contexto:
- **Menu Sidebar**: Link de navegação que direciona para `/admin/analytics`
- **Página de Analytics**: Dashboard com métricas e performance da plataforma
- Ícone utilizado: `BarChart3` do Lucide React
- Subtítulo: "Métricas e performance da plataforma"

---

## Menu Principal de Restaurantes

### Localização:
| Arquivo | Linha | Componente |
|---------|-------|------------|
| `components/Layout/Sidebar.tsx` | L31-L39 | Array `navigation` |

### Itens do Menu:
```tsx
const navigation = [
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

### Estrutura Visual:
```
Menu de Restaurantes (Sidebar)
├── Dashboard          → /dashboard     (LayoutDashboard)
├── Clientes           → /customers     (Users)
├── Fidelidade         → /loyalty       (Gift)
├── Campanhas          → /campaigns     (Megaphone)
├── Cardápio Digital   → /menu          (MenuIcon)
├── QR Codes           → /qr-codes      (QrCode)
├── POS - Frente de Caixa → /pos        (Calculator)
├── Relatórios         → /reports       (BarChart3)
└── Configurações      → /settings      (Settings)
```

### Páginas Correspondentes:
| Menu Item | Rota | Arquivo da Página |
|-----------|------|-------------------|
| Dashboard | `/dashboard` | `app/dashboard/page.tsx` |
| Clientes | `/customers` | `app/customers/page.tsx` |
| Fidelidade | `/loyalty` | `app/loyalty/page.tsx` |
| Campanhas | `/campaigns` | `app/campaigns/page.tsx` |
| Cardápio Digital | `/menu` | `app/menu/page.tsx` |
| QR Codes | `/qr-codes` | `app/qr-codes/page.tsx` |
| POS - Frente de Caixa | `/pos` | `app/pos/page.tsx` |
| Relatórios | `/reports` | `app/reports/page.tsx` |
| Configurações | `/settings` | `app/settings/page.tsx` |

### Observações:
- Este menu aparece para **todos os usuários autenticados**
- O menu é renderizado no componente `Sidebar`
- Os ícones são do pacote `lucide-react`
- O item ativo é destacado com a cor primária do White Label

---

## Estrutura de Navegação Admin

```
Administração (seção - apenas super admin)
├── Administração SaaS → /admin/users (página de gestão de usuários)
├── White Label → /admin/white-label (página de configuração white label)
└── Analytics SaaS → /admin/analytics (página de métricas)
```

---

## Componentes Principais

### Sidebar (`components/Layout/Sidebar.tsx`)
- Responsável por renderizar toda a navegação lateral
- Contém o array `adminNavigation` com os 3 itens admin
- Verifica permissão de super admin antes de mostrar seção de administração
- Integra com `WhiteLabelContext` para aplicar cores personalizadas

### Páginas Admin
- **`app/admin/users/page.tsx`**: Página "Administração SaaS" - gestão de usuários e plataforma
- **`app/admin/white-label/page.tsx`**: Página "Administração White Label" - gestão de clientes
- **`app/admin/analytics/page.tsx`**: Página "Analytics SaaS" - métricas da plataforma

---

## Cardápio Digital - Menu Público

### URL de Acesso
```
http://localhost:3000/menu/[slug]
Exemplo: http://localhost:3000/menu/restaurante-do-jo%C3%A3o
```

### Arquivo Principal
**`app/menu/[slug]/page.tsx`** - Página do cardápio digital público

---

## 5. Formulário "Endereço de entrega" (Delivery)

### Localização:
| Arquivo | Linhas | Componente |
|---------|--------|------------|
| `app/menu/[slug]/page.tsx` | L266-L405 | `LocationScreen` (quando `orderType === 'delivery'`) |

### Textos e Campos:
```
Endereço de entrega
Para calcularmos a taxa de entrega

┌─────────────────────────────────────┐
│ CEP                                 │
│ [00000-000                        ] │
├─────────────────────┬───────────────┤
│ Rua                 │ Nº            │
│ [Nome da rua      ] │ [123        ] │
├─────────────────────┴───────────────┤
│ Bairro                              │
│ [Nome do bairro                   ] │
├─────────────────────────────────────┤
│ Complemento (opcional)              │
│ [Apto, bloco, etc.                ] │
├─────────────────────────────────────┤
│ Taxa de entrega         R$ XX,XX    │
│ Tempo estimado: XX min              │
└─────────────────────────────────────┘

[      Continuar para o cardápio      ]
```

### Código Relevante (L327-L384):
```tsx
<div>
  <label>CEP</label>
  <input placeholder="00000-000" />
</div>

<div className="grid grid-cols-3 gap-3">
  <div className="col-span-2">
    <label>Rua</label>
    <input placeholder="Nome da rua" />
  </div>
  <div>
    <label>Nº</label>
    <input placeholder="123" />
  </div>
</div>

<div>
  <label>Bairro</label>
  <input placeholder="Nome do bairro" />
</div>

<div>
  <label>Complemento (opcional)</label>
  <input placeholder="Apto, bloco, etc." />
</div>

<button>Continuar para o cardápio</button>
```

### State Utilizado:
```tsx
const [deliveryAddress, setDeliveryAddress] = useState({
  zipCode: '',
  street: '',
  number: '',
  neighborhood: '',
  complement: '',
  deliveryFee: 0,
  estimatedTime: 0
});
```

---

## 6. Formulário "Qual sua mesa?" (Dine-in)

### Localização:
| Arquivo | Linhas | Componente |
|---------|--------|------------|
| `app/menu/[slug]/page.tsx` | L266-L321 | `LocationScreen` (quando `orderType === 'dine-in'`) |

### Textos e Campos:
```
Qual sua mesa?
Informe o número da sua mesa

┌─────────────────────────────────────┐
│ Número da mesa                      │
│ [Ex: 05                           ] │
├─────────────────────────────────────┤
│ ℹ️ Como funciona:                   │
│                                     │
│ • Navegue pelo cardápio digital     │
│ • Adicione itens ao carrinho        │
│ • Chame o garçom para finalizar     │
└─────────────────────────────────────┘

[      Continuar para o cardápio      ]
```

### Código Relevante (L283-L321):
```tsx
<div>
  <label>Número da mesa</label>
  <input
    type="text"
    value={selectedTable}
    onChange={(e) => setSelectedTable(e.target.value)}
    placeholder="Ex: 05"
  />
</div>

<div className="bg-green-50 p-4 rounded-xl">
  <div className="flex items-start space-x-3">
    <Info className="w-5 h-5 text-green-600" />
    <div>
      <p className="font-medium">Como funciona:</p>
      <ul>
        <li>• Navegue pelo cardápio digital</li>
        <li>• Adicione itens ao carrinho</li>
        <li>• Chame o garçom para finalizar</li>
      </ul>
    </div>
  </div>
</div>

<button disabled={!selectedTable}>
  Continuar para o cardápio
</button>
```

### State Utilizado:
```tsx
const [selectedTable, setSelectedTable] = useState('');
```

---

## Fluxo de Navegação do Cardápio Digital

```
┌──────────────────┐
│   Welcome Screen │  (Escolha: Mesa ou Delivery)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Location Screen │  
│                  │
│  ┌─────────────┐ │
│  │ Dine-in    │──┼──► Formulário "Qual sua mesa?"
│  └─────────────┘ │
│  ┌─────────────┐ │
│  │ Delivery   │──┼──► Formulário "Endereço de entrega"
│  └─────────────┘ │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Menu Screen    │  (Cardápio com categorias e produtos)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Cart Screen    │  (Carrinho de compras)
└──────────────────┘
```

### Componentes Internos da Página:
- `WelcomeScreen` - Tela inicial de boas-vindas
- `LocationScreen` - Formulários de mesa/endereço
- `MenuScreen` - Cardápio com produtos
- `CartScreen` - Carrinho de compras

---

*Documentação gerada em: 08/01/2026*
