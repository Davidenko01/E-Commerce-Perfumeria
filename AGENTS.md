# Perfumería Backend - Agent Instructions

## Project Structure

- `perfumeria-backend/` - NestJS API (port 3000)
- `perfumeria-frontend/` - React + Vite app (port 5173)
- `perfumeria-backend/docs/` - Documentación del proyecto

## Developer Commands

**Backend:**

```bash
cd perfumeria-backend
npm run start:dev      # Start with watch mode (port 3000)
npm run lint            # Lint + Prettier fix
npm run test            # Run unit tests
npm run test:e2e        # Run e2e tests
npm run build           # Build para producción
```

**Frontend:**

```bash
cd perfumeria-frontend
npm run dev             # Start dev server (port 5173)
npm run build           # TypeScript check + Vite build
npm run lint            # ESLint
```

## Setup Requirements

- **Frontend**: Create `perfumeria-frontend/.env` with `VITE_API_URL=http://localhost:3000`
- **Database**: Run `docker-compose up -d` for PostgreSQL on port 5432
- **Prisma generate**: `npx prisma generate` after schema changes

## Database (Phase 3)

- PostgreSQL via Docker Compose (port 5432)
- Prisma schema: `perfumeria-backend/prisma/schema.prisma`
- Prisma client outputs to `perfumeria-backend/generated/prisma/` (custom, not node_modules)
- **Current schema is MVP** — algunos modelos están simplificados para将来扩展

### Para aplicar migraciones:

```bash
cd perfumeria-backend
npx prisma migrate dev --name init
```

## Key Architecture Notes

- Backend uses **mock data** currently; Prisma schema ready for Phase 3 PostgreSQL migration
- CORS is hardcoded to `http://localhost:5173` in `src/main.ts`
- Backend modules: `auth`, `brands`, `products`, `showroom`, `users`, `prisma`
- Prisma generator uses `moduleFormat = "cjs"` (CommonJS)

## Prisma Schema (MVP Models)

```
Usuario → Pedido → ItemPedido → VariantePerfume
   ↓         ↓
  Pago    MetodoPago → PagoEvento

Marca → Perfume → VariantePerfume
          ↓
      Categoria
```

**Models ready for Phase 3:**

- Usuario, Marca, Perfume, Categoria
- VariantePerfume, Carrito, ItemCarrito
- Pedido, ItemPedido, MetodoPago
- Pago, PagoEvento

**Postponed (future phases):**

- MovimientoStock, Logistica, Direccion
- Linea, Acordes, Resena

## Testing

- Backend tests live alongside source files (`.spec.ts`)
- Frontend uses flat ESLint config; backend uses flat config with Prettier plugin

## Documentation

- `docs/DATA_MODEL.md` — Full data model documentation with all entities and relationships
