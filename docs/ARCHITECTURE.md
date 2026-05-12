# Perfumería — Architecture Decision Record

## Overview

E-commerce de lujo para showroom de perfumería. Plataforma web con catálogo
avanzado (filtros por notas olfativas, marcas, familias), carrito, checkout
con Mercado Pago, panel administrativo y sistema de reseñas con moderación.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | NestJS | 11 |
| ORM | Prisma | 7 |
| DB | PostgreSQL | 15 (Alpine, docker-compose) |
| Auth | Passport JWT | 4 |
| Frontend | React + Vite | 19 / 8 |
| Styles | Tailwind CSS | 4 |
| Server state | TanStack Query | 5 |
| HTTP client | Axios | 1.14 |
| Icons | Lucide React | 1.11 |

## Project Structure

```
/
├── docker-compose.yml              # PostgreSQL dev container (dev_user:dev_password, :5432, perfumeria_db)
├── AGENTS.md                       # AI agent quick-reference
├── docs/
│   ├── ARCHITECTURE.md             # This file
│   ├── ROADMAP.md                  # Phased execution plan
│   └── DATA_MODEL.md               # ER diagrams + field docs (in perfumeria-backend/docs/)
│
├── perfumeria-backend/
│   ├── prisma/
│   │   ├── schema.prisma           # 20 models, 4 migrations
│   │   ├── seed.ts                 # 7 brands, 4 categories, 3 perfumes, admin user
│   │   └── migrations/
│   ├── src/
│   │   ├── main.ts                 # Bootstrap: CORS, ValidationPipe, listen :3000
│   │   ├── app.module.ts           # Imports all 10 feature modules
│   │   ├── auth/                   # Login, register, JWT strategy + guards + @Roles decorator
│   │   ├── users/                  # Usuarios CRUD (ADMIN-only, soft-delete)
│   │   ├── productos/              # Catálogo: CRUD, filtros, paginación, variantes, notas
│   │   ├── variantes/              # CRUD + stock update + activate (only module with tests)
│   │   ├── marcas/                 # Marcas CRUD
│   │   ├── categorias/             # Categorías CRUD (hard-delete — bug)
│   │   ├── carrito/                # Cart: add/update/remove/clear (user-scoped)
│   │   ├── pedidos/                # Orders: CRUD + status workflow (items broken — bug)
│   │   ├── showroom/               # Mock data only (no DB table)
│   │   ├── prisma/                 # PrismaService (@Global), adapter-pg
│   │   └── generated/prisma/       # Prisma client (CJS, gitignored)
│   └── test/                       # E2E specs
│
└── perfumeria-frontend/
    ├── src/
    │   ├── main.tsx                # React 19 entry with StrictMode
    │   ├── App.tsx                 # Routes (only / active, 5 commented out)
    │   ├── pages/Home.tsx          # Only page: renders Hero
    │   ├── components/
    │   │   ├── Hero.tsx            # Carousel slider (hardcoded images/sale logic)
    │   │   └── NavBar.tsx          # Nav with glassmorphism + mobile menu
    │   ├── services/api.ts         # 15 API functions, JWT interceptor
    │   ├── hooks/useProducts.ts    # EMPTY (0 bytes)
    │   ├── context/                # EMPTY (AuthProvider + CartProvider planned)
    │   ├── types/index.ts          # 16 interfaces matching backend schema
    │   ├── lib/products.ts         # ORPHANED: 388 lines of mock data, never imported
    │   └── index.css               # Tailwind 4 + shadcn-compatible tokens
    └── public/
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  Client (React :5173)                                   │
│  TanStack Query ──▶ Axios (api.ts) ── Bearer JWT ──▶   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  NestJS API (:3000)                                     │
│                                                         │
│  ┌──────────┐  ┌───────────┐  ┌───────────────┐        │
│  │ AuthGuard│  │ RolesGuard│  │ ValidationPipe │        │
│  │ (jwt)    │  │ (@Roles)  │  │ (whitelist)   │        │
│  └────┬─────┘  └─────┬─────┘  └───────┬───────┘        │
│       └──────────────┼────────────────┘                │
│                      ▼                                  │
│              Controller Layer                           │
│                      │                                  │
│                      ▼                                  │
│              Service Layer                              │
│                      │                                  │
│                      ▼                                  │
│  ┌─────────────────────────────────────┐               │
│  │ PrismaService (@Global)             │               │
│  │ @prisma/adapter-pg → pg driver      │               │
│  └────────────────┬────────────────────┘               │
└───────────────────┼─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  PostgreSQL :5432 (docker)                              │
│  perfumeria_db — 20 tables migrated                     │
└─────────────────────────────────────────────────────────┘
```

## Auth Flow

1. `POST /auth/register` → bcrypt hash → create Usuario (role=USER) → sign JWT → return `{ access_token, user }`
2. `POST /auth/login` → verify bcrypt → sign JWT (sub, email, role) → return `{ access_token, user }`
3. Protected routes: `JwtAuthGuard` extracts Bearer → `JwtStrategy.validate()` → `req.user = { id, email, role }`
4. Admin routes: `RolesGuard` reads `@Roles('ADMIN')` metadata → checks `req.user.role`
5. JWT payload: `{ sub: userId, email, role }` — no refresh mechanism yet

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Soft delete everywhere** | `activo: false` instead of DELETE. Recoverable, preserves referential integrity. All modules now consistent (categorías fixed 2026-05-11). |
| **Price snapshot** | `ItemCarrito.precioUnitario` and `ItemPedido.precioUnitario` freeze the price at add/buy time. No recalculation. |
| **Stock audit trail** | `MovimientoStock` records every change with `stock_anterior` + `stock_posterior` + `tipo` + `motivo`. Reversible. (Schema exists, code not yet written) |
| **Prisma adapter-pg** | Direct connection via `@prisma/adapter-pg`. For production, migrate to `pg.Pool` with connection pooling. |
| **JWT stateless** | No server-side sessions. Token expires in 8h. Refresh tokens planned for Fase 3. |
| **Review moderation** | `Resena.estado`: PENDIENTE → APROBADA / RECHAZADA. Only verified purchasers can review (pedidoId FK). Admin can respond. (Schema exists, code not yet written) |
| **CORS whitelist** | `http://localhost:5173` only. Expand to production domain in deployment. |
| **ValidationPipe global** | `whitelist: true` strips unknown properties from DTOs. Add `forbidNonWhitelisted: true` for stricter validation. |

## Prisma Schema Models — Implementation Status

```
 ACTIVE (12/20)              INACTIVE (8/20)
 ─────────────               ──────────────
 Usuario       ✓ service     Direccion        ✗ no code
 Marca         ✓ service     MetodoPago       ✗ no code
 Perfume       ✓ service     Pago             ✗ no code
 Categoria     ✓ service     PagoEvento       ✗ no code
 VariantePerfume ✓ service   Cupon            ✗ no code
 Carrito       ✓ service     UsoCupon         ✗ no code
 ItemCarrito   ✓ (via carrito) MovimientoStock ✗ no code
 Pedido        ✓ service     Resena           ✗ no code
 ItemPedido    ✓ (read only)
 FamiliaOlfativa ✓ (read via perfume includes)
 PerfumeNota   ✓ (via perfume create/update)
 Nota          ✓ (read via perfume includes)
```

## Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET` | Yes | HMAC-SHA256 key (no hardcoded fallback in prod) |
| `JWT_EXPIRES_IN` | No | Default: `8h` |
| `PORT` | No | Default: `3000` |
| `VITE_API_URL` | Yes (frontend) | `http://localhost:3000` |
| `CLOUDINARY_URL` | Future | Image hosting |
| `MERCADOPAGO_ACCESS_TOKEN` | Future | Payment gateway |
| `SENDGRID_API_KEY` | Future | Transactional emails |

## Conventions

- **DTOs**: Spanish (`CrearPerfumeDto`, `ActualizarMarcaDto`). Use `PartialType` for updates.
- **Interfaces**: Mix of Spanish (`UsuarioResponse`) and English (`PerfumeResponse`).
- **Imports**: Use tsconfig paths: `@/`, `@generated/`, `@prisma/`.
- **Module style**: One module per feature. `PrismaModule` is `@Global()`.
- **Module names**: NestJS module classes end in `Module`. Spanish dirs (`productos/`, `categorias/`) with English class files (`productos.module.ts`).
- **Error handling**: NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, `UnauthorizedException`). No try/catch in controllers.
- **Transactions**: `prisma.$transaction()` for multi-table writes (e.g., create perfume + variants + notes atomically).

## Bugs Fixed (Fase 1 — 2026-05-11)

| # | File | Fix |
|---|------|-----|
| 1 | `pedidos.service.ts:128-134` | Items creation uncommented; `nombre`, `marca`, `volumen`, `precioAnterior`, `etiquetaDescuento`, `subtotal` populated from variante + perfume. Carrito query extended to include `perfume.marca`. |
| 2 | `productos.service.ts:239-241` | `minPrice`/`maxPrice` applied via `where.variantes: { some: { precio: { gte/lte } } }`. |
| 3 | `categorias.service.ts:delete()` | Hard-delete → soft-delete (`activo: false`). |
| 4 | `categorias.service.ts:findAll()` | Added `where: { activo: true }`. |
| 5 | `marcas.service.ts:findOne()` | `findUnique({ id })` → `findFirst({ id, activo: true })`. |
| 6 | `users/.../user-response.interface.ts` + `usuarios.service.ts` | Added `apellido` field to interface, 4 Prisma `select` clauses now include `apellido: true`. |

**Noted but not changed**: `POST /usuarios` has no auth guard — intentional (used internally by `auth/register`). Add guard if endpoint is exposed independently.

## Dead Code

| File | Lines | Notes |
|------|-------|-------|
| `productos/interfaces/prisma-perfume.interface.ts` | ~50 | Duplicates Prisma auto-generated types |
| `users/dto/create-user.dto.ts` | ~15 | English version of `crear-usuario.dto.ts`, never used |
| `users/interfaces/user-safe.interface.ts` | ~10 | Never imported |
| `variantes/entities/variante.entity.ts` | ~10 | NestJS boilerplate, never imported |
| `perfumeria-frontend/src/lib/products.ts` | 388 | 16 mock products, never imported |

## References

- Prisma schema: `perfumeria-backend/prisma/schema.prisma` (20 models)
- Data model docs: `perfumeria-backend/docs/DATA_MODEL.md` (partially outdated)
- Roadmap: `docs/ROADMAP.md`
- Agent instructions: `AGENTS.md`
