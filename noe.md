# 🚀 MASTER PROMPT - GastroBI+ Full Stack System

> **⚠️ CRITICAL**: CTO-level engineering. Production-ready code only.

---

## 📋 CONTEXT

Analyze `main` branch → Extract and separate into **4 independent projects** preserving EXACT UI/UX.

## 🎯 GENERATION ORDER (MANDATORY)

```
1️⃣ BACKEND FIRST → gastrobi-backend (NestJS + Prisma v7)
2️⃣ FRONTEND USERS → gastrobi-frontend-users (Public menu)
3️⃣ FRONTEND RESTAURANTS → gastrobi-frontend-restaurants (Dashboard)
4️⃣ FRONTEND ADMIN → gastrobi-frontend-admin (SaaS Admin)
```

**WHY**: Frontends consume real API. **NO MOCK DATA.**

---

# ⛔ HARD REQUIREMENTS

## Locked Dependencies (IMMUTABLE)
```json
{
  "next": "16.0.10",
  "react": "19.2.1",
  "react-dom": "19.2.1",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.469.0",
  "qrcode.react": "^4.2.0",
  "recharts": "^2.15.0",
  "crypto-js": "^4.2.0",
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4"
}
```

## Zero Mock Data Policy
- **FORBIDDEN**: Hardcoded data, mock arrays, fake responses
- **REQUIRED**: React Suspense, loading states, error boundaries, skeletons
- **REQUIRED**: All data from `gastrobi-backend` API

## Authentication Model
- **NO self-registration** - Admin creates users and restaurants
- Separate login: `/api/v1/auth/admin/login` vs `/api/v1/auth/restaurant/login`

---

# ⚙️ BACKEND: gastrobi-backend

## Stack
`NestJS v10+ | Prisma v7 | PostgreSQL 15+ | Redis 7+ | Cloudinary | JWT | Swagger | Jest`

## API Versioning
All endpoints under `/api/v1/*`

## Required Modules
`auth | users | restaurants | customers | products | categories | orders | tables | loyalty | campaigns | white-label | analytics | billing | audit-logs | uploads | health`

## Testing (MINIMUM 100 TESTS, 80% COVERAGE)

| Category | Count | Focus |
|----------|-------|-------|
| Unit | 60 | Services, controllers, guards |
| Integration | 25 | Auth flows, tenant isolation, orders |
| E2E | 15 | Full user journeys |

**Key scenarios**: Auth (12), Users (10), Restaurants (12), Customers (10), Products (10), Orders (14), Loyalty (8), Campaigns (8)

## Core Patterns

### Multi-Tenancy
- `restaurantId` on tenant-scoped entities
- TenantMiddleware extracts from JWT
- TenantGuard enforces ownership
- Admins bypass via `x-tenant-id` header

### Soft Delete
- `deletedAt` on all models
- Prisma middleware auto-filters
- No physical deletes

### Audit Logging
- Log: CREATE, UPDATE, DELETE, LOGIN
- Store: userId, action, entity, entityId, oldValue, newValue, ip, userAgent

### Idempotency
- `x-idempotency-key` header
- Redis-backed, 24h TTL

### Observability
- Structured JSON logs
- Health: `/health`, `/health/ready`, `/health/live`

### Docker
- Multi-stage (node:20-alpine)
- Target: < 512MB RAM

---

# 📱 FRONTEND 1: gastrobi-frontend-users

Public digital menu via QR Code.

## Routes
```
/menu/[slug]              → Restaurant menu
/menu/[slug]?table=XX     → Pre-selected table
```

## Features (EXACT UI from main)
- **Welcome**: Logo, name, "Dine-in"/"Delivery", hours, contact
- **Location**: Table input OR address form (ZIP, street, number)
- **Menu**: Categories, products, images, prices, badges, search, cart
- **Cart**: Items, quantities, totals, send order

## Requirements
PWA | Mobile-first | White Label theming | i18n (pt-BR) | SEO | Lazy loading | Skeletons

## Context
```typescript
interface MenuPublicContextType {
  restaurant: Restaurant | null;
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orderType: 'dine-in' | 'delivery';
  tableNumber: string;
  deliveryAddress: DeliveryAddress;
  isLoading: boolean;
}
```

---

# 🏪 FRONTEND 2: gastrobi-frontend-restaurants

Restaurant dashboard for owners/managers.

## Routes
```
/login | /dashboard | /customers | /customers/[id] | /loyalty
/campaigns | /menu | /qr-codes | /pos | /reports | /settings
```

## Sidebar
```typescript
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Loyalty', href: '/loyalty', icon: Gift },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Digital Menu', href: '/menu', icon: MenuIcon },
  { name: 'QR Codes', href: '/qr-codes', icon: QrCode },
  { name: 'POS', href: '/pos', icon: Calculator },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];
```

## Features (EXACT UI from main)

| Page | Features |
|------|----------|
| Dashboard | Metrics, charts (Recharts), top products, alerts, activities |
| Customers | List, search, filters, profile, orders, points, LTV, tags, CRUD |
| Loyalty | Points rules, levels, rewards, redemption history |
| Campaigns | Create (WhatsApp/Email/SMS), segmentation, templates, metrics |
| Menu | CRUD categories/products, images, variations, extras, drag-and-drop |
| QR Codes | Generate for tables, download, print template |
| POS | Modules: Balcão, Mesa, Comanda, Delivery, Kitchen (KDS) |
| Reports | Sales, best sellers, top customers, peak hours, export |
| Settings | Restaurant, Profile, Integrations, Notifications, Billing, Security |

## Contexts
```typescript
// AuthContext: user, isAuthenticated, login, logout, switchRestaurant
// DataContext: customers, products, campaigns, alerts, loyaltyRules, dashboardData
// MenuContext: categories, products, tables, CRUD operations
// POSContext: products, orders, tables, tabs, activeModule, createOrder
// WhiteLabelContext: logo, colors, brandName, favicon, customCSS/JS
```

---

# 👑 FRONTEND 3: gastrobi-frontend-admin

SaaS admin panel. **ADMIN CREATES EVERYTHING.**

## Routes
```
/login | /admin/dashboard | /admin/users | /admin/restaurants
/admin/white-label | /admin/analytics | /admin/billing | /admin/logs | /admin/settings
```

## Sidebar
```typescript
const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Activity },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Restaurants', href: '/admin/restaurants', icon: Building2 },
  { name: 'White Label', href: '/admin/white-label', icon: Palette },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/admin/billing', icon: CreditCard },
  { name: 'Logs', href: '/admin/logs', icon: ScrollText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];
```

## Features (MANDATORY)

| Page | Features |
|------|----------|
| Dashboard | Users, restaurants by status, MRR, churn, growth charts |
| Users | List, **create user + restaurant**, edit, ban/unban, reset password, impersonate |
| Restaurants | List, **create**, details, suspend/activate, change plan, usage |
| White Label | Create client, domain, logo, colors, features, CSS/JS, preview |
| Analytics | Platform metrics, cohorts, retention, feature usage |
| Billing | Subscriptions, payments, invoices, plans, coupons |
| Audit Logs | All actions, filters, export |
| Settings | Env vars, plan limits, integrations, maintenance, feature flags |

---

# 🗄️ DATABASE ENTITIES

## Models (all with `deletedAt` for soft delete)

### Core
- **User**: email, passwordHash, type (RESTAURANT|ADMIN), role, fullName, phone, avatar, 2FA
- **Restaurant**: slug, name, cnpj, address, phone, status, timezone, settings, openingHours
- **RestaurantUser**: userId, restaurantId, role, permissions, isDefault

### Business
- **Customer**: restaurantId, name, email, phone, birthday, points, level, totalSpent, visitCount, tags
- **Category**: restaurantId, name, description, image, order
- **Product**: restaurantId, categoryId, name, price, cost, image, variations (JSON), extras (JSON), allergens
- **Table**: restaurantId, number, capacity, qrCodeUrl, status
- **Order**: restaurantId, customerId?, tableId?, type, status, total, subtotal, discount, deliveryFee, paymentMethod
- **OrderItem**: orderId, productId, productName, price, quantity, observations, extras, variation

### Marketing
- **Campaign**: restaurantId, name, type, status, message, segmentation, scheduledFor, metrics
- **LoyaltyRule**: restaurantId, name, type, points, conditions
- **LoyaltyReward**: restaurantId, name, pointsCost, type, value
- **LoyaltyHistory**: customerId, type, points, rewardId

### Platform
- **Subscription**: restaurantId, plan, status, period, stripeIds
- **Payment**: subscriptionId, amount, status, invoiceUrl
- **WhiteLabelConfig**: clientName, brandName, domain, logo, colors, features, customCSS/JS
- **AuditLog**: userId, userType, action, entity, entityId, oldValue, newValue, ip, userAgent

## Enums
```
UserType: RESTAURANT | ADMIN
UserRole: SUPER_ADMIN | ADMIN | OWNER | MANAGER | STAFF
RestaurantStatus: ACTIVE | TRIAL | SUSPENDED | CANCELLED
SubscriptionPlan: BASIC | PREMIUM | ENTERPRISE
CustomerLevel: BRONZE | SILVER | GOLD
OrderType: BALCAO | MESA | COMANDA | DELIVERY
OrderStatus: OPEN | PREPARING | READY | COMPLETED | CANCELLED
CampaignType: WHATSAPP | EMAIL | SMS
CampaignStatus: DRAFT | SCHEDULED | ACTIVE | PAUSED | COMPLETED
```

## Key Constraints
- User.email → UNIQUE
- Restaurant.slug → UNIQUE
- Customer.phone → UNIQUE per restaurant
- Table.number → UNIQUE per restaurant
- Order.idempotencyKey → UNIQUE

---

# 📦 API ENDPOINTS

## Auth
```
POST /api/v1/auth/login/restaurant | POST /api/v1/auth/login/admin
POST /api/v1/auth/refresh | POST /api/v1/auth/logout | GET /api/v1/auth/me
```

## Admin Only
```
/api/v1/admin/users       → GET, POST, GET/:id, PATCH/:id, DELETE/:id, POST/:id/ban, POST/:id/reset-password
/api/v1/admin/restaurants → GET, POST, GET/:id, PATCH/:id, DELETE/:id, POST/:id/suspend, POST/:id/activate
/api/v1/admin/analytics   → GET/overview, GET/revenue, GET/growth, GET/retention
/api/v1/admin/audit       → GET, GET/export, GET/stats
```

## Tenant-Scoped
```
/api/v1/customers    → CRUD + GET/:id/orders, POST/:id/points, GET/export
/api/v1/categories   → CRUD + PATCH/reorder
/api/v1/products     → CRUD + POST/:id/image, PATCH/:id/toggle, PATCH/reorder
/api/v1/orders       → CRUD + PATCH/:id/status, POST/:id/cancel, GET/kitchen, GET/reports/*
/api/v1/tables       → CRUD + PATCH/:id/status, POST/:id/qr-code
/api/v1/campaigns    → CRUD + POST/:id/schedule, POST/:id/pause, GET/:id/metrics
/api/v1/loyalty/rules | /api/v1/loyalty/rewards | POST /api/v1/loyalty/redeem
```

## Public (No Auth)
```
GET /api/v1/menu/:slug | GET /api/v1/menu/:slug/product/:id | POST /api/v1/menu/:slug/order
```

## Health
```
GET /api/v1/health | GET /api/v1/health/ready | GET /api/v1/health/live
```

---

# 🌱 SEED DATA

## Required Seeds

1. **Super Admin**: admin@gastrobi.com / admin123 / SUPER_ADMIN

2. **White Label**: FoodTech Pro / foodtech.pro / custom colors

3. **Sample Restaurant**: Restaurante do João
   - slug: restaurante-do-joao
   - Owner: joao@restaurante.com / 123456
   - 5 categories: Pizzas, Lanches, Bebidas, Sobremesas, Pratos Executivos
   - 15+ products with variations/extras
   - 12 tables
   - 3 customers: Maria (GOLD), João (SILVER), Ana (BRONZE)
   - Loyalty rules: purchase, checkin, birthday, referral
   - Subscription: PREMIUM / ACTIVE

---

# 🐳 DOCKER

```yaml
services:
  api:
    build: . # Multi-stage, node:20-alpine
    ports: ["3000:3000"]
    depends_on: [db, redis]
  db:
    image: postgres:15-alpine
  redis:
    image: redis:7-alpine
```

---

# 📋 CHECKLIST

## All Frontends
- [ ] `npm install && npm run build` pass
- [ ] Responsive (mobile/tablet/desktop)
- [ ] i18n (pt-BR)
- [ ] Suspense + Skeletons
- [ ] Error boundaries
- [ ] **NO MOCK DATA**

## Backend
- [ ] **100+ tests, 80% coverage**
- [ ] Swagger at `/api/docs`
- [ ] API versioned `/api/v1/*`
- [ ] Multi-tenancy isolation
- [ ] Soft delete
- [ ] Audit logging
- [ ] Idempotency
- [ ] Docker < 512MB

## Security
- [ ] bcrypt (cost 10+)
- [ ] JWT (access: 15min, refresh: 7d)
- [ ] Rate limiting (100 req/min)
- [ ] CORS configured
- [ ] Input validation
- [ ] AdminGuard + TenantGuard

---

# 🎯 ACCEPTANCE CRITERIA

| # | Criterion |
|---|-----------|
| 1 | All 3 frontends navigable |
| 2 | `npm run build` passes in ALL 4 projects |
| 3 | 100+ tests, 80% coverage |
| 4 | `docker-compose up` works |
| 5 | Swagger at /api/docs |
| 6 | All endpoints under /api/v1/* |
| 7 | Tenant data isolation |
| 8 | All actions audit logged |
| 9 | Soft delete only |
| 10 | Idempotency working |
| 11 | **NO MOCK DATA** |
| 12 | **EXACT UI** from main |
| 13 | Admin creates everything |

---

# 🚨 HARD BLOCKS

**REJECT if:**
1. ❌ Mock/hardcoded data in frontends
2. ❌ < 100 tests
3. ❌ API not versioned
4. ❌ Swagger missing
5. ❌ Self-registration exists
6. ❌ No soft delete
7. ❌ No audit logging
8. ❌ No multi-tenancy
9. ❌ Dependency versions changed
10. ❌ UI differs from main

---

*Version 3.0 | January 8, 2026*
