# Perfumería — Execution Roadmap

---

## Fase 1: Estabilización (Prioridad: CRÍTICA)

**Objetivo**: Arreglar bugs que rompen funcionalidad core. Backend pasa tests.

**Progreso**: 6/7 bugs resueltos (2026-05-11). `npm run build` y `npm run test` pasan.

### Bugs corregidos ✅

| # | Archivo | Problema | Solución | Estado |
|---|---------|----------|----------|--------|
| 1 | `pedidos.service.ts:128-134` | Items creation commented out | Descomentado, poblados `nombre`, `marca`, `volumen`, `precioAnterior`, `etiquetaDescuento`, `subtotal` desde variante + perfume | ✅ |
| 2 | `productos.service.ts:239-240` | Filtros `minPrice`/`maxPrice` no aplicados | `where.variantes: { some: { precio: { gte/lte } } }` en `buildWhereClause()` | ✅ |
| 3 | `categorias.service.ts:delete()` | Hard-delete | `update({ where: { id }, data: { activo: false } })` | ✅ |
| 4 | `categorias.service.ts:findAll()` | Sin filtro `activo` | `where: { activo: true }` | ✅ |
| 5 | `marcas.service.ts:findOne()` | Sin filtro `activo` | `findFirst({ id, activo: true })` | ✅ |
| 6 | `users/user-response.interface.ts` | Falta `apellido` | Agregado `apellido: string`, 4 `select` de Prisma actualizados | ✅ |
| 7 | `POST /usuarios` | Público sin validación | Pendiente — decisión de diseño (se usa internamente desde auth/register) | ⏸️ |

### Mejoras de infraestructura

- [ ] **`@nestjs/config` + `ConfigModule.forRoot({ isGlobal: true })`** — Reemplazar `process.env` + `dotenv.config()` por `ConfigService` con validación de Zod.
- [ ] **Swagger básico** (`@nestjs/swagger`) — Documentar todos los endpoints en `/api/docs`.
- [ ] **Health check** (`@nestjs/terminus`) — `GET /health` con DB check.
- [ ] **Limpiar código muerto** — Eliminar los 5 archivos listados en ARCHITECTURE.md.
- [ ] **Tests unitarios** — Auth, productos, pedidos (actualmente solo variantes tiene).

### Entregables Fase 1

- `npm run test` pasa sin errores
- `npm run lint` limpio
- Pedidos se crean con items y cálculo correcto
- Filtros de precio funcionales
- Swagger en `/api/docs`

---

## Fase 2: Funcionalidades Core de Lujo (Prioridad: ALTA)

**Objetivo**: Los diferenciadores que hacen premium al e-commerce.

### 2.1 Sistema de Reseñas

```
Modelo: Resena (schema listo)
Endpoints:
  GET    /productos/:id/resenas        (público, solo APROBADA)
  POST   /productos/:id/resenas        (JWT, verifica pedidoId)
  PATCH  /resenas/:id/aprobar          (ADMIN)
  PATCH  /resenas/:id/rechazar         (ADMIN)
  POST   /resenas/:id/responder        (ADMIN, respuesta_admin)
  PATCH  /resenas/:id/like             (JWT)
```

Campos: calificación 1-5, título, comentario, ventajas, desventajas, estado (PENDIENTE/APROBADA/RECHAZADA), respuesta_admin, likes.

### 2.2 Auditoría de Stock

```
Modelo: MovimientoStock (schema listo)
Integrar en:
  - variantes.service.ts:updateStock()    → registrar movimiento
  - pedidos.service.ts:create()           → VENTA (negativo)
  - Futuro admin: ajuste manual           → INGRESO_MANUAL / EGRESO_MANUAL / AJUSTE
```

Cada movimiento registra: `varianteId`, `tipo`, `cantidad`, `stock_anterior`, `stock_posterior`, `motivo`, `pedidoId?`.

### 2.3 Lógica de Cupones

```
Modelos: Cupon + UsoCupon (schema listo)
Endpoints:
  POST   /cupones                        (ADMIN) Crear cupón
  GET    /cupones                        (ADMIN) Listar
  GET    /cupones/validar/:codigo        (JWT) Validar antes de aplicar
  PATCH  /cupones/:id                    (ADMIN) Editar
  DELETE /cupones/:id                    (ADMIN) Soft-delete

Validación en checkout:
  - Código existe y activo
  - No expiró (expira > now)
  - No superó maxCantUsos
  - Usuario no lo usó antes (@@unique([cuponId, usuarioId]))
  - Pedido supera montoMinimoCompra
  - Aplica descuento: porcentaje o monto fijo → recalcula total
```

### 2.4 Pasarela de Pagos (Mercado Pago)

```
Modelos: Pago + PagoEvento + MetodoPago (schema listo)
Endpoints:
  POST   /pagos/crear-preferencia        (JWT) Crear preferencia MP
  POST   /pagos/webhook                  (público, firma MP) Recibir notificaciones
  GET    /pagos/:id                      (JWT) Estado del pago
  GET    /metodos-pago                   (público) Listar métodos activos

Flujo:
  1. POST /pedidos → crea pedido PENDIENTE
  2. POST /pagos/crear-preferencia → MP Checkout Pro
  3. Usuario paga en MP
  4. Webhook notifica → PagoEvento registra transición
  5. Pedido pasa a CONFIRMADO
  6. Stock se descuenta (MovimientoStock VENTA)
```

### 2.5 Direcciones de Usuario

```
Modelo: Direccion (schema listo)
Endpoints:
  GET    /usuarios/me/direcciones         (JWT) Listar
  POST   /usuarios/me/direcciones         (JWT) Crear
  PATCH  /usuarios/me/direcciones/:id     (JWT) Editar
  DELETE /usuarios/me/direcciones/:id     (JWT) Soft-delete
  PATCH  /usuarios/me/direcciones/:id/principal (JWT) Marcar principal
```

Checkout selecciona dirección guardada o ingresa nueva.

### 2.6 Subida de Imágenes (Cloudinary)

```
Nuevo módulo: src/media/
Endpoints:
  POST   /media/upload                    (ADMIN) Upload imagen
  DELETE /media/:publicId                 (ADMIN) Borrar imagen

Integrar con:
  - productos.service.ts: imagenUrl + galeriaImagenes
  - marcas.service.ts: logoUrl
```

Usar Cloudinary SDK con transformaciones: auto-format, quality=auto, width escalado.

### 2.7 Notificaciones Email

```
Nuevo módulo: src/notificaciones/
Disparadores:
  - Pedido CONFIRMADO → email confirmación
  - Pedido LISTO_RETIRO / DESPACHADO → email update
  - Pedido CANCELADO → email cancelación
  - (Futuro) Recuperación de contraseña

Implementar con Nodemailer + plantillas HTML.
```

### 2.8 Panel Admin — Métricas Básicas

```
Nuevo módulo: src/admin/
Endpoints (todos ADMIN):
  GET /admin/dashboard                 → KPIs: ventas hoy/semana/mes, pedidos pendientes, stock bajo, usuarios nuevos
  GET /admin/stock-bajo                → Variantes con stock < 5
  GET /admin/pedidos-recientes         → Últimos 20 pedidos con estado
  GET /admin/usuarios-nuevos           → Usuarios registrados este mes
```

### Entregables Fase 2

- Reseñas con moderación funcional
- Cada cambio de stock deja traza en MovimientoStock
- Cupones validados en checkout
- Pago con Mercado Pago end-to-end
- Imágenes servidas por Cloudinary
- Emails transaccionales
- Dashboard admin con KPIs

---

## Fase 3: Experiencia Premium (Prioridad: MEDIA)

### 3.1 Búsqueda Avanzada

- Filtro por notas olfativas (`?notas=bergamota,rosa`)
- Typo-tolerance con `pg_trgm` (trigram similarity)
- Ordenamiento: precio ASC/DESC, novedades, más vendidos, mejor calificados
- Búsqueda full-text en `nombre` + `descripcion`

### 3.2 Showroom Gestionable

- Migrar de mock a tabla DB + admin CRUD
- Campos: nombre, dirección, teléfono, email, instagram, horarios, coordenadas mapa, fotos del local

### 3.3 Wishlist / Favoritos

```
Nuevo modelo: Favorito (usuarioId, perfumeId, @@unique)
Endpoints:
  GET    /usuarios/me/favoritos
  POST   /usuarios/me/favoritos/:perfumeId
  DELETE /usuarios/me/favoritos/:perfumeId
```

### 3.4 Recuperación de Contraseña

```
Endpoints:
  POST /auth/forgot-password         → email con token (JWT 15min)
  POST /auth/reset-password          → nueva contraseña + token
```

### 3.5 Rate Limiting

- `@nestjs/throttler` global
- `ThrottlerGuard` en `POST /auth/login` (5 intentos/min por IP)
- `POST /auth/register` (3 cuentas/min por IP)

### 3.6 Seguridad HTTP

- `helmet` para headers de seguridad
- CSP (Content-Security-Policy)
- CORS restringido a dominio producción

### 3.7 Cache (Redis)

- Productos más vistos / destacados (1h TTL)
- Rate limiting distribuido
- Sesiones si se usa refresh tokens

### 3.8 Recomendaciones

- "También compraron" basado en co-ocurrencia en ItemPedido
- "Similares" por misma familia olfativa + rango de precio
- "Tendencias" por ventas recientes

### Entregables Fase 3

- Búsqueda con typo-tolerance y filtro por notas
- Showroom editable desde admin
- Favoritos funcional
- Recuperación de contraseña
- Rate limiting en auth
- Recomendaciones básicas

---

## Fase 4: Producción (Prioridad: MEDIA-BAJA)

### 4.1 CI/CD Pipeline (GitHub Actions)

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [checkout, node, npm ci, npm run lint]
  test:
    needs: lint
    services: [postgres:15]
    steps: [checkout, node, npm ci, npx prisma generate, npx prisma migrate deploy, npm run test, npm run test:e2e]
  build:
    needs: test
    steps: [checkout, node, npm ci, npm run build]
```

### 4.2 Docker

- `perfumeria-backend/Dockerfile` — Multi-stage: build → production
- `perfumeria-frontend/Dockerfile` — Build estático → nginx
- `docker-compose.prod.yml` — Backend + Frontend + PostgreSQL + Redis

### 4.3 Monitoreo

- Logging estructurado (JSON) con niveles
- Health check endpoint para uptime monitoring
- Sentry para errores en producción

### 4.4 Backups

- pg_dump programado (cron) a S3/Cloudinary
- Retention: diarios 7 días, semanales 4 semanas, mensuales 6 meses

### 4.5 SEO / Performance

- SSR o SSG para páginas de producto (SEO)
- Sitemap.xml dinámico
- Meta tags (Open Graph para compartir perfumes)
- Lazy loading de imágenes
- Code splitting por ruta

### Entregables Fase 4

- CI/CD funcional (lint → test → build → deploy)
- Docker multi-stage
- Monitoreo y alertas
- Backups automáticos
- Optimización SEO

---

## Resumen de Estado Actual (Backend)

```
 Módulo          CRUD   Auth   Tests   Bugs
 ──────────────────────────────────────────
 auth            ✓      ✓      ✗       ✗
 usuarios        ✓      ✓      ✗       1
 productos       ✓      parcial ✗      1
 variantes       ✓      ✓      ✓       ✗
 marcas          ✓      parcial ✗      1
 categorias      ✓      parcial ✗      2
 carrito         ✓      ✓      ✗       ✗
 pedidos         ✓      ✓      ✗       1 (crítico)
 showroom        mock   ✗      ✗       ✗
 ──────────────────────────────────────────
 INACTIVOS: pagos, resenas, cupones, direcciones, movimientos-stock
```

## Stack Futuro (ya planeado)

| Necesidad | Solución | Fase |
|-----------|----------|------|
| Imágenes | Cloudinary SDK | 2 |
| Pagos | Mercado Pago Checkout Pro | 2 |
| Email | Nodemailer + Handlebars | 2 |
| Cache | Redis (ioredis) | 3 |
| Rate limiting | @nestjs/throttler | 3 |
| Monitoreo | Sentry + health checks | 4 |
| CI/CD | GitHub Actions | 4 |
| Deployment | Docker + nginx | 4 |
