# Perfumería — Agent Instructions

## Setup

```bash
docker-compose up -d      # PostgreSQL on port 5432
cd perfumeria-backend
npx prisma generate       # Prisma client -> src/generated/prisma/ (CJS, gitignored)
npx prisma migrate dev
npm run seed              # ts-node --compiler-options '{"module":"CommonJS"}'
cd ../perfumeria-frontend
# create .env with: VITE_API_URL=http://localhost:3000
npm run dev               # Vite on :5173
```

**Database credentials mismatch**: `docker-compose.yml` creates `dev_user:dev_password` on port `5432` (db `perfumeria_db`), but `perfumeria-backend/.env` has `postgres:Mallow00` on port `5433` (db `postgres`). The `.env` is gitignored — update it to match docker-compose if you use the default container.

**Required env vars** (no `.env.example` exists):
- Backend: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- Frontend: `VITE_API_URL`

## Commands

| cd to | Command | What |
|---|---|---|
| `perfumeria-backend` | `npm run start:dev` | NestJS watch mode (:3000) |
| | `npm run lint` | ESLint flat config + Prettier fix |
| | `npm run test` | Jest unit tests (`**/*.spec.ts`) |
| | `npm run test:e2e` | E2E via `test/jest-e2e.json` |
| | `npm run build` | `nest build` |
| `perfumeria-frontend` | `npm run dev` | Vite dev server (:5173) |
| | `npm run build` | `tsc -b && vite build` |
| | `npm run lint` | ESLint flat config |

Frontend has no test script.

## Backend architecture

- **NestJS 11** with `nodenext` module resolution
- **Path aliases** (tsconfig paths): `@/` -> `src/`, `@generated/` -> `src/generated/`, `@prisma/` -> `src/generated/prisma/`
- **Prisma 7** with `@prisma/adapter-pg` + `pg` — adapter pattern in `PrismaService` (`src/prisma/prisma.service.ts:9`)
- **Prisma client**: CommonJS output at `src/generated/prisma/` — import from `../generated/prisma/client`
- **Flat ESLint config** (`eslint.config.mjs`) with `@typescript-eslint` + Prettier plugin
- **JWT auth**: `JwtAuthGuard` + `RolesGuard` with `@Roles('ADMIN')` decorator
- CORS allows `http://localhost:5173` only

## Backend modules

| Source dir | Route prefix | Notes |
|---|---|---|
| `auth/` | `/auth` | Login, register, JWT strategy |
| `users/` | `/usuarios` | Module class is `UsuariosModule` |
| `productos/` | `/productos` | Paginated, filterable, includes variantes + notas |
| `variantes/` | `/variantes` | CRUD + stock update, ADMIN auth. Only module with tests. |
| `marcas/` | `/marcas` | |
| `categorias/` | `/categorias` | |
| `carrito/` | `/carrito` | |
| `pedidos/` | `/pedidos` | |
| `showroom/` | `/showroom` | **Uses mock data** (only module not on Prisma) |

## Fase 1 — Bugs fixed (2026-05-11)

All 6 structural bugs resolved. `npm run build` and `npm run test` pass.

1. **`pedidos.service.ts:128-134`** — Items creation uncommented, populates `nombre`, `marca`, `volumen`, `precioAnterior`, `etiquetaDescuento`, `subtotal` from variante + perfume relations.
2. **`productos.service.ts:239-241`** — `minPrice`/`maxPrice` now applied via `where.variantes.some({ precio: { gte/lte } })`.
3. **`categorias.service.ts:delete()`** — Changed to soft delete (`activo: false`).
4. **`categorias.service.ts:findAll()`** — Now filters `where: { activo: true }`.
5. **`marcas.service.ts:findOne()`** — Changed from `findUnique({ id })` to `findFirst({ id, activo: true })`.
6. **`users/user-response.interface.ts` + `usuarios.service.ts`** — Added `apellido` field. All 4 `select` clauses now include `apellido: true`.

Remaining Fase 1 tasks (infrastructure): `@nestjs/config` migration, Swagger, health check, dead code cleanup, test coverage.

## Dead code (safe to delete)

| File | Why |
|------|-----|
| `productos/interfaces/prisma-perfume.interface.ts` | Duplicates Prisma auto-generated types |
| `users/dto/create-user.dto.ts` | English duplicate of `crear-usuario.dto.ts`, never imported |
| `users/interfaces/user-safe.interface.ts` | Never imported |
| `variantes/entities/variante.entity.ts` | NestJS boilerplate class, never used |
| `perfumeria-frontend/src/lib/products.ts` | 388 lines of mock data, never imported |

## 8/20 Prisma models have no service code

Models with schema + migration but zero runtime usage: `Direccion`, `MetodoPago`, `Pago`, `PagoEvento`, `Cupon`, `UsoCupon`, `MovimientoStock`, `Resena`. These are planned features (see `docs/ROADMAP.md`).

## Frontend state

Only `Home.tsx` page live. `App.tsx` has many routes commented out (`ProductoDetalle`, `Carrito`, `Checkout`, etc.). Stack: React 19, React Router 7, TanStack Query, Tailwind CSS v4, Axios.

- `src/hooks/useProducts.ts` is empty (0 bytes).
- `src/context/` is empty — `AuthProvider` and `CartProvider` are referenced in comments but don't exist.
- `src/services/api.ts` has 15 API functions covering all backend endpoints. Fully typed.
- `Hero.tsx` uses hardcoded image URLs and fake sale logic (first 3 products get -20% regardless of actual data).

## Testing quirks

- Unit tests use `tsconfig.test.json` (CommonJS module override). Jest config at `jest.config.js`.
- E2E config at `test/jest-e2e.json` — separate ts-jest transform
- Only `variantes` module has unit tests. Auth, productos, and pedidos have none.
- No CI workflows configured

## Seed

Creates 7 brands, 4 categories, 8 olfactory families, ~26 notes, 3 perfumes (Bleu de Chanel, Sauvage, Tobacco Vanille) with varying-volume variants, and admin user `admin@perfumeria.com` / `admin123`.

## Schema

`prisma/schema.prisma` — 20 models, all migrated. `perfumeria-backend/docs/DATA_MODEL.md` has the ER diagram (partially outdated — lists some models as "future phases" that are already migrated).

## Docs

- `docs/ARCHITECTURE.md` — Full architecture overview, data flow, design decisions, model coverage
- `docs/ROADMAP.md` — 4-phase execution plan: Stabilization → Core Features → Premium UX → Production
