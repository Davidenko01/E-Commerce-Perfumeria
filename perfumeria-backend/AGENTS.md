# Perfumería - Agent Instructions

## Project Structure

- `perfumeria-backend/` - NestJS API (port 3000)
- `perfumeria-frontend/` - React + Vite app (port 5173)
- `perfumeria-backend/docs/` - Documentación del proyecto

## Developer Commands

**Backend:**

```bash
cd perfumeria-backend
npm run start:dev      # Start with watch mode (port 3000)
npm run lint           # Lint + Prettier fix
npm run test           # Run unit tests
npm run test:e2e       # Run e2e tests
npm run build          # Build para producción
npm run seed           # Run database seed
```

**Frontend:**

```bash
cd perfumeria-frontend
npm run dev             # Start dev server (port 5173)
npm run build           # TypeScript check + Vite build
npm run lint            # ESLint
```

## Setup Requirements

1. **Database**: `docker-compose up -d` (PostgreSQL on port 5432)
2. **Generate Prisma client**: `npx prisma generate`
3. **Apply migrations**: `npx prisma migrate dev --name init`
4. **Seed database**: `npm run seed`
5. **Frontend**: Create `perfumeria-frontend/.env` with `VITE_API_URL=http://localhost:3000`

## Backend Modules (Spanish naming)

| Module        | Ruta          | Descripción               |
| ------------- | ------------- | ------------------------- |
| `auth/`       | `/auth`       | Login, register, JWT      |
| `marcas/`     | `/marcas`     | CRUD marcas               |
| `categorias/` | `/categorias` | Familias olfativas        |
| `productos/`  | `/productos`  | CRUD perfumes + variantes |
| `usuarios/`   | `/usuarios`   | CRUD usuarios             |
| `carrito/`    | `/carrito`    | Gestión carrito           |
| `pedidos/`    | `/pedidos`    | Órdenes de compra         |
| `showroom/`   | `/showroom`   | Info del local            |
| `variantes/`  | `/variantes`  | CRUD variantes perfume    |

## Prisma Schema

- Prisma schema: `perfumeria-backend/prisma/schema.prisma`
- Prisma client outputs to `perfumeria-backend/src/generated/prisma/`
- Generator uses `moduleFormat = "cjs"` (CommonJS)
- Prisma 7 requiere adapter `@prisma/adapter-pg` + `pg` para conectar a PostgreSQL

### Modelo VariantePerfume

| Campo     | Tipo          | Notas                        |
| --------- | ------------- | ---------------------------- |
| id        | Int (PK)      | Autoincrement                |
| perfumeId | Int (FK)      | -> Perfume                   |
| volumen   | Int           | En ml (30, 50, 100, etc.)    |
| precio    | Decimal(10,2) | Precio en ARS                |
| stock     | Int           | Default: 0                   |
| sku       | String        | Unique, código identificador |
| activo    | Boolean       | Default: true                |

### Modelos MVP activos:

- `Usuario`, `Marca`, `Perfume`, `Categoria`
- `VariantePerfume` (ml, precio, stock por perfume)
- `Carrito`, `ItemCarrito`
- `Pedido`, `ItemPedido`
- `MetodoPago`, `Pago`, `PagoEvento`

### Postergados (futuras fases):

- `MovimientoStock`, `Logistica`, `Direccion`
- `Linea`, `Acordes`, `Resena`

## Seed Data

Run `npm run seed` para populate la base de datos con:

- 6 categorías (familias olfativas)
- 6 marcas (Dior, Chanel, Tom Ford, YSL, Paco Rabanne, Mugler)
- 12 perfumes con variantes (30ml, 50ml, 100ml)
- Admin user: `admin@perfumeria.com` / `admin123`

## API Endpoints - Variantes

| Método | Ruta                      | Descripción                              | Auth  |
| ------ | ------------------------- | ---------------------------------------- | ----- |
| GET    | `/variantes`              | Listar todas (filtros opcionales)        | No    |
| GET    | `/variantes/:id`          | Obtener una por ID                       | No    |
| GET    | `/variantes/sku/:sku`     | Obtener una por SKU                      | No    |
| POST   | `/variantes`              | Crear nueva variante                     | ADMIN |
| PATCH  | `/variantes/:id`          | Actualizar variante                      | ADMIN |
| DELETE | `/variantes/:id`          | Desactivar variante (soft delete)        | ADMIN |
| POST   | `/variantes/:id/activate` | Activar variante                         | ADMIN |
| PATCH  | `/variantes/:id/stock`    | Actualizar stock (incremento/decremento) | ADMIN |

## Testing

- Tests viven junto a los source files (`.spec.ts`)
- Backend usa flat ESLint config con Prettier plugin

## Documentation

- `docs/DATA_MODEL.md` — Modelo de datos completo
