# Auditoría Técnica y Roadmap — E-commerce Perfumería

## Context

Plataforma e-commerce para un showroom de perfumería. Stack: NestJS + Prisma + PostgreSQL (backend) y React 19 + Vite + Tailwind v4 + TanStack Query (frontend). Repo en formato pseudo-monorepo (dos carpetas independientes: `perfumeria-backend/` y `perfumeria-frontend/`).

**Estado real del proyecto:**
- Backend ~70% de los CRUDs implementados (auth, productos, variantes, marcas, categorías, carrito, pedidos, usuarios, showroom mock).
- Frontend ~10% (NavBar, Home placeholder con `<h1>HOLAAAAAAAAAAAAAAAAAAA</h1>`, cliente Axios + React Query configurados pero sin pantallas reales).
- Schema Prisma con 11 modelos y todos los enums de pago/pedido ya pensados para MercadoPago.

**Decisiones de producto confirmadas:**
- Stock: validar al checkout (no reservar al carrito).
- Admin: rutas `/admin/*` protegidas dentro del mismo frontend.
- Pagos: MercadoPago dentro del MVP.
- Guest checkout: **no**, login obligatorio.

---

## 1. AUDITORÍA — Bugs, riesgos y malas prácticas

### 🔴 CRÍTICOS (rompen el negocio o son data-corruption)

| # | Issue | Archivo | Detalle |
|---|---|---|---|
| C1 | **`PedidosService.create` no decrementa stock ni valida disponibilidad** | [pedidos.service.ts:96-159](perfumeria-backend/src/pedidos/pedidos.service.ts:96) | Riesgo de overselling. Hoy se puede crear un pedido aunque `variante.stock = 0`. |
| C2 | **Crear pedido NO es transaccional** | [pedidos.service.ts:113-156](perfumeria-backend/src/pedidos/pedidos.service.ts:113) | Se hace `pedido.create(...)` y luego `carrito.update({estado:'COMPLETADO'})` en queries separadas. Si la segunda falla, queda un pedido huérfano con carrito activo. Debe ir todo dentro de `prisma.$transaction`. |
| C3 | **`JWT_SECRET` con fallback hardcodeado `'SUPER_SECRET_KEY'`** | `perfumeria-backend/src/auth/auth.module.ts` | Si la env var no está seteada, el server arranca igual con un secreto público. Cualquiera puede firmar tokens válidos. Debe fallar al boot si falta. |
| C4 | **`CarritoService.agregarItem` no valida stock ni que la variante esté `activo:true`** | [carrito.service.ts:60-105](perfumeria-backend/src/carrito/carrito.service.ts:60) | Permite cargar al carrito variantes inactivas o agotadas. |
| C5 | **`ProductosService.update` reemplaza variantes con `deleteMany + create` sin transacción** | [productos.service.ts:128-143](perfumeria-backend/src/productos/productos.service.ts:128) | Borra ItemCarrito/ItemPedido referencias si Prisma no aborta (depende del FK behavior). Operación destructiva: perdés stock histórico y referencias. Debe ser UPSERT por SKU dentro de transacción. |
| C6 | **`nroPedido` generado con `Date.now() + random` puede colisionar** | [pedidos.service.ts:10-14](perfumeria-backend/src/pedidos/pedidos.service.ts:10) | Bajo carga concurrente la unicidad no está garantizada. El `@unique` en DB lo va a rechazar con 500 en vez de retry. Usar `nanoid` o secuencia DB. |

### 🟡 ALTOS (seguridad / lógica de negocio incorrecta)

| # | Issue | Archivo | Detalle |
|---|---|---|---|
| A1 | **Filtrado de precio en memoria** | [productos.service.ts:60-70](perfumeria-backend/src/productos/productos.service.ts:60) | Trae TODOS los perfumes y filtra en JS. No escala. Mover a `where.variantes.some({precio: {gte, lte}})`. |
| A2 | **Costo de envío hardcodeado a 1500** | [pedidos.service.ts:119-120](perfumeria-backend/src/pedidos/pedidos.service.ts:119) | Sin tabla de costos por zona/peso ni config externa. Mínimo, mover a `@nestjs/config`. |
| A3 | **Sin control de propiedad en endpoints de pedidos** | `pedidos.controller.ts` | Falta verificar que un USER solo ve/modifica sus propios pedidos (un ADMIN sí puede ver todos, pero un USER no debería ver `/pedidos/:id` de otro). |
| A4 | **Schema sin índices en FKs y campos de búsqueda** | [schema.prisma](perfumeria-backend/prisma/schema.prisma) | Faltan `@@index` en: `Perfume.marcaId`, `Perfume.categoriaId`, `Perfume.activo`, `VariantePerfume.perfumeId`, `Pedido.usuarioId`, `Pedido.estado`, `Pago.estado`, `Carrito.usuarioId+estado`. |
| A5 | **`Categoria` sin soft delete** | [schema.prisma:126-135](perfumeria-backend/prisma/schema.prisma:126) | Inconsistente con Marca/Perfume. Borrar una categoría puede fallar por FK o perder integridad histórica. Agregar `activo Boolean @default(true)`. |
| A6 | **Sin `ExceptionFilter` global → errores de Prisma se filtran crudos** | `main.ts` | Un `P2002` (unique violation) llega al cliente como 500 con stack. Necesitamos un `PrismaExceptionFilter` que mapee a 409/404/400. |
| A7 | **Inconsistencia: register pide pass 6+ chars, login exige 8+** | `auth/dto/register.dto.ts` vs `auth/dto/login.dto.ts` | Usuarios registrados con 6-7 chars no pueden volver a loguearse. |
| A8 | **`Decimal` de Prisma serializado como string al cliente** | múltiples controllers | El frontend tipa `precio: number` ([types/index.ts](perfumeria-frontend/src/types/index.ts)) pero la API devuelve `"199.99"`. Bug latente al hacer cálculos. Hay que transformar con un interceptor o `class-transformer`. |
| A9 | **`AuthProvider` y `CartProvider` no existen en el frontend** | [App.tsx](perfumeria-frontend/src/App.tsx) | Están comentados. Sin esto no hay manera de proteger rutas ni mostrar el carrito en NavBar. |
| A10 | **`useProducts.ts` está vacío** | [hooks/useProducts.ts](perfumeria-frontend/src/hooks/useProducts.ts) | El archivo solo tiene `export`. React Query está configurado pero no hay un solo hook real. |

### 🟠 MEDIOS (code quality / mantenibilidad)

- M1: Sin `@nestjs/config` aunque está instalado. CORS, JWT exp, costo de envío están hardcoded en código.
- M2: Sin logger global de NestJS ni interceptor de request/response.
- M3: Tests prácticamente inexistentes (solo dos smoke specs en `variantes/`).
- M4: Sin Husky/lint-staged/commitlint a nivel raíz.
- M5: Sin CI (no hay `.github/workflows/`).
- M6: Sin Dockerfile para backend ni frontend (solo `docker-compose.yml` con Postgres).
- M7: TypeScript `~6.0.2` en el frontend (versión muy reciente / inestable). Bajar a `~5.6.x` para evitar incompatibilidades con `@types/react` y `vite`.
- M8: NavBar referencia rutas que no existen (`/products`, `/cart`) e incluso inconsistentes con las comentadas en App.tsx (`/carrito`).
- M9: Tailwind v4 sin archivo de config separado. Funciona pero dificulta extender el design system.
- M10: `Home.tsx` es literalmente `<h1>HOLAAAAAAAAAAAAAAAAAAA</h1>`. No es bug pero define el punto de partida real del frontend.

---

## 2. REFACTORIZACIÓN previa al crecimiento

Antes de seguir agregando features, hay tres refactors que conviene hacer porque cuanto más código se agregue encima, más costoso será cambiarlos después.

### R1 — Stock + Pedido como operación transaccional (bloqueante)

**Por qué ahora:** Es el corazón del negocio y hoy está roto (C1+C2). Cualquier feature nueva que toque pedidos sin esto consolida la deuda.

**Cambio concreto en `PedidosService.create`:**

```ts
return this.prisma.$transaction(async (tx) => {
  // 1. Releer carrito DENTRO de la transacción
  const carrito = await tx.carrito.findFirst({
    where: { usuarioId, estado: 'ACTIVO' },
    include: { items: { include: { variante: true } } },
  });
  if (!carrito || carrito.items.length === 0) {
    throw new BadRequestException('El carrito está vacío');
  }

  // 2. Validar stock de TODAS las variantes
  for (const item of carrito.items) {
    if (!item.variante.activo) {
      throw new BadRequestException(`Variante ${item.varianteId} inactiva`);
    }
    if (item.variante.stock < item.cantidad) {
      throw new ConflictException(
        `Stock insuficiente para variante ${item.varianteId}: hay ${item.variante.stock}, pediste ${item.cantidad}`,
      );
    }
  }

  // 3. Decrementar stock con UPDATE atómico condicional
  for (const item of carrito.items) {
    const result = await tx.variantePerfume.updateMany({
      where: { id: item.varianteId, stock: { gte: item.cantidad } },
      data: { stock: { decrement: item.cantidad } },
    });
    if (result.count === 0) {
      // Stock cambió entre el check y el update → abortar transacción
      throw new ConflictException(`Stock agotado para variante ${item.varianteId}`);
    }
  }

  // 4. Crear pedido + items
  const pedido = await tx.pedido.create({ /* ... */ });

  // 5. Marcar carrito completado
  await tx.carrito.update({
    where: { id: carrito.id },
    data: { estado: 'COMPLETADO' },
  });

  return pedido;
});
```

**Clave:** el `updateMany` con `where: { stock: { gte: item.cantidad } }` es el equivalente a un compare-and-swap, evita race conditions sin necesidad de SELECT FOR UPDATE.

### R2 — `ConfigModule` global + validación de env vars al boot

**Por qué ahora:** Quita los magic numbers (1500 envío, JWT_SECRET fallback, CORS origin) y hace que el boot falle ruidosamente si falta algo crítico, en vez de fallar en producción de forma silenciosa.

**Cambios:**
- `app.module.ts`: agregar `ConfigModule.forRoot({ isGlobal: true, validate: validateEnv })` con validación Joi o class-validator (`JWT_SECRET` requerido min 32 chars, `DATABASE_URL` URL válida, `MP_ACCESS_TOKEN` requerido en prod, `COSTO_ENVIO_DEFAULT` Int).
- `auth.module.ts`: usar `JwtModule.registerAsync` inyectando `ConfigService`.
- `main.ts`: leer `CORS_ORIGIN` del config.
- `pedidos.service.ts`: leer costo de envío del config (luego, fase posterior, moverlo a tabla `ConfiguracionEnvio`).

### R3 — `PrismaExceptionFilter` global + transformador de `Decimal`

**Por qué ahora:** Antes de que se sumen 20 endpoints más, fijar un contrato de errores y un contrato de tipos numéricos. Re-trabajar después significa tocar todos los servicios.

**Cambios:**
- Crear `src/common/filters/prisma-exception.filter.ts` que mapee `P2002 → 409`, `P2025 → 404`, etc.
- Crear `src/common/interceptors/decimal.interceptor.ts` (o usar `class-transformer` con `@Expose({ toPlainOnly: true })` y `Type(() => Number)`) que convierta `Decimal → number` en las respuestas. Alternativa: en cada DTO de respuesta usar `Number(x.precio)`.
- Registrar ambos globalmente en `main.ts`.

### R4 — Frontend: capa de contexto y rutas (preparar el terreno)

**Por qué ahora:** Sin `AuthContext` no se puede empezar el flujo de checkout, login, ni proteger admin. Es base estructural.

**Cambios:**
- Crear `src/context/AuthContext.tsx` (estado: `user`, `token`, `login()`, `logout()`, `isAdmin`). Persistir token en `localStorage` (ya hay interceptor en `api.ts`).
- Crear `src/context/CartContext.tsx` que envuelve `useQuery(['carrito'])` y expone `agregar`, `quitar`, `actualizar`, `count`, `total`.
- Crear `src/components/ProtectedRoute.tsx` y `AdminRoute.tsx` (HOCs / wrappers que redirigen a `/login` o `/` si no cumple rol).
- Definir el árbol de rutas final (en `App.tsx`) usando un layout: `<Layout><Outlet /></Layout>` con NavBar + Footer compartidos.
- Renombrar `/cart` → `/carrito` en NavBar para que no haya inconsistencia con el resto.
- Implementar `useProducts.ts` real con `useQuery(['productos', filtros], () => getPerfumes(filtros))`.

---

## 3. ROADMAP — Plan de Acción priorizado

Cada bloque es una unidad de trabajo cerrada que terminamos antes de pasar al siguiente. Los nombres son los que vamos a usar como referencia cuando los abordemos uno por uno.

### **FASE 0 — Estabilización (1-2 días)** *priorizada antes de cualquier feature nueva*

0.1. **Refactor R2** — `ConfigModule` + validación env. JWT_SECRET obligatorio. Crear `.env.example`.
0.2. **Refactor R3** — `PrismaExceptionFilter` + transformador `Decimal`.
0.3. **Refactor R1** — `PedidosService.create` transaccional con validación + decremento de stock.
0.4. **Bug A4** — Agregar índices al `schema.prisma` y correr `prisma migrate dev`.
0.5. **Bug A5** — Soft delete en `Categoria` (campo `activo`).
0.6. **Bug A7** — Unificar mínimo de password (8 chars en register y login).
0.7. **Bug C4** — Validar stock + variante activa en `CarritoService.agregarItem`.
0.8. **Bug C5** — `ProductosService.update` con upsert por SKU dentro de transacción.

**Criterio de salida:** un test e2e que cree un pedido con stock, valide que el stock se decrementa, e intente crear otro pedido sin stock y reciba 409.

---

### **FASE 1 — Frontend: catálogo público navegable (3-5 días)**

1.1. **Refactor R4** — Contextos Auth/Cart + ProtectedRoute + Layout + ruteo final.
1.2. **Componente `ProductCard`** — card con imagen, marca, nombre, rango de precios por variante, badge "sin stock".
1.3. **Página `Productos`** (`/productos`) — grid de cards con paginación + filtros (sidebar: marca, género, categoría, rango de precio). Usar `useProducts` con `useQuery`.
1.4. **Página `ProductoDetalle`** (`/productos/:slug`) — selector de variante (volumen), botón "agregar al carrito" (solo si autenticado), info de marca y categoría.
1.5. **Home real** — hero + grid de novedades (últimos 8 perfumes) + sección de marcas. Reemplazar el `<h1>HOLAAAAAAAAAAAAAAAAAAA</h1>`.
1.6. **Loading/Error states** — skeletons en cards, ErrorBoundary, toast notifications (sumar `sonner`).

**Criterio de salida:** un visitante anónimo puede entrar a la home, ver productos, filtrar y abrir un detalle. NO puede agregar al carrito (lo invita a loguearse).

---

### **FASE 2 — Autenticación end-to-end (2-3 días)**

2.1. **Páginas `Login` y `Register`** — formularios con `react-hook-form` + `zod` para validación. Manejar errores de API (email duplicado, credenciales inválidas).
2.2. **Persistencia y refresh** — al recargar la app, si hay token en `localStorage`, validar contra `GET /usuarios/me` (endpoint nuevo a crear en backend) y poblar `AuthContext`.
2.3. **Logout + expiración** — interceptor de Axios que detecta 401 y limpia `AuthContext` + redirige a `/login`.
2.4. **NavBar dinámico** — mostrar "Mi cuenta / Logout" si autenticado, "Login" si no. Mostrar badge con count del carrito.
2.5. **Backend: endpoint `GET /usuarios/me`** — protegido con `JwtAuthGuard`, devuelve el user actual sin passwordHash.

**Criterio de salida:** registro → login → recarga → sigo logueado → logout limpia todo.

---

### **FASE 3 — Carrito completo (2-3 días)**

3.1. **Página `Carrito`** (`/carrito`) — lista de items con thumbnail, controles +/-, subtotal, botón "ir a checkout". Protegida con `ProtectedRoute`.
3.2. **Mutations con React Query** — `useMutation` para agregar/quitar/actualizar item con `invalidateQueries(['carrito'])` al éxito. Optimistic updates en cantidad.
3.3. **Backend bugfix** — exponer endpoint `GET /carrito/count` ligero para el badge del NavBar.
3.4. **Backend** — endpoint `POST /carrito/validar` que pre-valida stock antes de ir a checkout (UX, no de seguridad — el check real es transaccional en pedido).
3.5. **Frontend** — mostrar warning si alguna variante quedó sin stock antes del checkout.

**Criterio de salida:** logueado, puedo agregar, modificar, quitar items. Si abro otra pestaña, ambos carritos están sincronizados (porque React Query refetchea).

---

### **FASE 4 — Checkout + MercadoPago (4-6 días)**

4.1. **Página `Checkout`** (`/checkout`) — paso 1: tipo de entrega (envío/retiro). Si envío: dirección, ciudad, provincia, CP. Paso 2: resumen + botón "pagar".
4.2. **Backend** — `POST /pedidos` ya existe; verificar que cumple con el R1 transaccional. Devolver el `pedidoId`.
4.3. **Backend** — instalar `mercadopago` SDK. Crear `PagosService.crearPreferencia(pedidoId)` que llama a MP y guarda `external_id` en `Pago`. Endpoint `POST /pagos/preferencia/:pedidoId`.
4.4. **Backend** — webhook `POST /pagos/webhook` (público, validado por firma MP) que actualiza el estado del `Pago` y, si `APROBADO`, mueve el `Pedido` a `CONFIRMADO`. Registrar `PagoEvento` siempre. **Transaccional.**
4.5. **Frontend** — al confirmar checkout: crear pedido → obtener preference_id → redirect a `init_point` de MP. Páginas de retorno: `/checkout/success`, `/checkout/failure`, `/checkout/pending`.
4.6. **Edge case** — si el pedido se crea pero el pago falla/expira, hay un cron job o endpoint manual que repone stock y cancela el pedido (`compensación`). Decisión a discutir cuando lleguemos: ¿reponemos stock al crear preferencia fallida, o solo al webhook de cancelación?

**Criterio de salida:** flujo completo de compra con sandbox de MP funcionando y stock decrementándose solo al pago aprobado (revisar si conviene mover el decremento al webhook en vez de al `POST /pedidos`).

---

### **FASE 5 — Historial de pedidos + perfil (1-2 días)**

5.1. **Página `MisPedidos`** (`/mis-pedidos`) — listado con estado, total, fecha, expandible para ver items.
5.2. **Página `Perfil`** (`/perfil`) — editar datos básicos, cambiar contraseña.
5.3. **Backend** — endpoint `PATCH /usuarios/me` para auto-edición sin requerir rol ADMIN. Endpoint `POST /auth/change-password`.

---

### **FASE 6 — Panel Admin (4-6 días)**

Todo bajo `/admin/*` con `AdminRoute` guard.

6.1. **Layout admin** — sidebar con secciones: Dashboard, Productos, Marcas, Categorías, Pedidos, Usuarios.
6.2. **Dashboard** — métricas básicas: pedidos del día, pendientes de envío, productos sin stock.
6.3. **CRUD Productos** — tabla con filtros, modal/página para crear y editar (incluido manejo de variantes y carga de imagen — definir si subida a S3/Cloudinary o solo URL externa).
6.4. **CRUD Marcas y Categorías** — más simples, tabla + modal.
6.5. **Pedidos admin** — listado de todos, filtros por estado, acción "marcar como enviado / entregado / cancelado". Si se cancela: reponer stock (transaccional).
6.6. **Gestión de stock** — endpoint y UI para ajuste manual de stock por variante (registrar quién y cuándo en una tabla `MovimientoStock` — schema change).

---

### **FASE 7 — Hardening / Producción (cuando se acerque al deploy)**

7.1. Tests unitarios + integración para AuthService, PedidosService, CarritoService (cobertura mínima 60% de servicios).
7.2. Tests e2e del flujo completo de compra.
7.3. `Dockerfile` para backend y frontend, `docker-compose.prod.yml`.
7.4. GitHub Actions: lint + test en PR, build en merge a main.
7.5. Husky + lint-staged + commitlint convencional.
7.6. Logger estructurado (Pino) + healthcheck (`GET /health`).
7.7. Rate limiting en `/auth/*` (nestjs-throttler).
7.8. Migración a `https` + `secure cookies` (si se mueve token de localStorage a cookie httpOnly, recomendado).

---

## Archivos críticos a tocar (referencia rápida)

### Backend
- [perfumeria-backend/prisma/schema.prisma](perfumeria-backend/prisma/schema.prisma) — índices, `Categoria.activo`, futuro `MovimientoStock`.
- [perfumeria-backend/src/pedidos/pedidos.service.ts](perfumeria-backend/src/pedidos/pedidos.service.ts) — refactor transaccional + stock (Fase 0).
- [perfumeria-backend/src/carrito/carrito.service.ts](perfumeria-backend/src/carrito/carrito.service.ts) — validación stock al agregar (Fase 0).
- [perfumeria-backend/src/productos/productos.service.ts](perfumeria-backend/src/productos/productos.service.ts) — filtro de precio en DB + upsert variantes (Fase 0).
- [perfumeria-backend/src/auth/auth.module.ts](perfumeria-backend/src/auth/auth.module.ts) — `JwtModule.registerAsync` con ConfigService (Fase 0).
- `perfumeria-backend/src/common/filters/prisma-exception.filter.ts` — crear (Fase 0).
- `perfumeria-backend/src/pagos/` — módulo nuevo (Fase 4).
- [perfumeria-backend/src/main.ts](perfumeria-backend/src/main.ts) — registrar filter, interceptor, CORS configurable.

### Frontend
- [perfumeria-frontend/src/App.tsx](perfumeria-frontend/src/App.tsx) — ruteo completo + Providers.
- [perfumeria-frontend/src/context/AuthContext.tsx](perfumeria-frontend/src/context/AuthContext.tsx) — crear.
- [perfumeria-frontend/src/context/CartContext.tsx](perfumeria-frontend/src/context/CartContext.tsx) — crear.
- [perfumeria-frontend/src/hooks/useProducts.ts](perfumeria-frontend/src/hooks/useProducts.ts) — vacío hoy, implementar (Fase 1).
- [perfumeria-frontend/src/pages/Home.tsx](perfumeria-frontend/src/pages/Home.tsx) — reescribir.
- [perfumeria-frontend/src/components/NavBar.tsx](perfumeria-frontend/src/components/NavBar.tsx) — corregir rutas, badge carrito, menu de usuario.
- [perfumeria-frontend/src/services/api.ts](perfumeria-frontend/src/services/api.ts) — interceptor 401, timeout.
- [perfumeria-frontend/src/types/index.ts](perfumeria-frontend/src/types/index.ts) — alinear con respuestas reales (Decimal as number).
- [perfumeria-frontend/package.json](perfumeria-frontend/package.json) — bajar TS a ~5.6, agregar `react-hook-form`, `zod`, `sonner`.

---

## Verificación end-to-end al cerrar cada fase

- **Fase 0:** `npm run test:e2e` con tests nuevos que cubran crear pedido feliz + sin stock + concurrente.
- **Fase 1:** `npm run dev` ambos lados, navegar manualmente catálogo y detalle, verificar filtros y que productos sin stock se muestran como tal.
- **Fase 2:** registro + login + recarga + logout manualmente. Inspeccionar `localStorage` para token y network tab para Authorization header.
- **Fase 3:** ciclo completo carrito + revisar invalidación de queries en DevTools de React Query.
- **Fase 4:** sandbox de MercadoPago + ngrok para webhook + caso fallido + caso aprobado.
- **Fase 5-6:** browsing manual de admin con cuenta `admin@perfumeria.com / admin123` del seed.

---

## Próximo paso sugerido

Arrancar por **Fase 0** atacando los items en orden: R2 → R3 → R1 → resto. Una vez aprobado el plan, te propongo abordar primero `0.1 ConfigModule` y `0.2 PrismaExceptionFilter` (son base para todo lo demás y no rompen nada existente), luego el grande `0.3 Pedidos transaccional`.
