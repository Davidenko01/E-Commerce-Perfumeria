# Modelo de Datos — Perfumería

## Diagrama de Entidades (MVP)

```
┌─────────────┐       ┌─────────────┐       ┌──────────────────┐
│   Usuario    │       │    Marca    │       │    Categoria     │
├─────────────┤       ├─────────────┤       ├──────────────────┤
│ id           │       │ id           │       │ id               │
│ nombre       │       │ nombre       │       │ nombre           │
│ apellido     │       │ descripcion  │       │ descripcion      │
│ email        │       │ paisOrigen   │       │ slug             │
│ passwordHash │       │ logoUrl      │       └────────┬─────────┘
│ telefono     │       └──────┬───────┘                │
│ role         │              │                        │
│ activo       │              │ 1:N                     │ 1:N
└──────┬───────┘              ▼                        ▼
       │                ┌─────────────┐       ┌──────────────────┐
       │ 1:N             │   Perfume    │       │  VariantePerfume │
       ▼                ├─────────────┤       ├──────────────────┤
┌─────────────┐        │ id           │       │ id               │
│    Pedido    │        │ marcaId (FK) │       │ perfumeId (FK)   │
├─────────────┤        │ categoriaId  │       │ volumen (ml)     │
│ id           │        │ nombre       │       │ precio           │
│ usuarioId(FK)│        │ descripcion   │       │ stock            │
│ nroPedido    │        │ concentracion │      │ sku              │
│ tipoEntrega  │        │ genero        │       │ activo           │
│ subtotal     │        │ tipo          │       └────────┬─────────┘
│ costoEnvio   │        │ imagenUrl     │                │
│ total        │        │ slug          │                │
│ estado       │        │ createdAt     │                │
│ observaciones│        └───────┬────────┘                │
│ (envío)      │                │                         │
└──────┬───────┘                │ N:N                     │ 1:N
       │                         ▼                ┌────────────┐
       │ 1:N              ┌─────────────┐          │ ItemPedido │
       ▼                 │ ItemCarrito │          ├────────────┤
┌─────────────┐         ├─────────────┤          │ pedidoId   │
│     Pago    │         │ carritoId   │          │ varianteId │
├─────────────┤         │ varianteId  │          │ cantidad   │
│ id           │         │ cantidad    │          │ precioUnit │
│ pedidoId(FK) │         │ precioUnit  │          └────────────┘
│ metodoPagoId │         └─────────────┘
│ estado       │
│ externalId   │         ┌─────────────┐
│ ...          │         │  Carrito    │
└──────┬───────┘         ├─────────────┤
       │ 1:N             │ id           │
       ▼                │ usuarioId    │
┌─────────────┐        │ estado       │
│  PagoEvento  │        │ creadoAt     │
├─────────────┤        └─────────────┘
│ id           │
│ pagoId (FK)  │
│ estadoAnterior│
│ estadoNuevo  │
│ origen       │
│ payload      │
│ fecha        │
└─────────────┘

┌─────────────┐
│  MetodoPago  │
├─────────────┤
│ id           │
│ nombre       │
│ tipo         │
│ activo       │
└─────────────┘
```

## Modelo Físico

### ENUMS

| Enum             | Valores                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `Role`           | ADMIN, USER                                                                                |
| `Genero`         | HOMBRE, MUJER, UNISEX                                                                      |
| `Concentracion`  | EF, EDC, EDT, EDP, PARFUM, ELIXIR                                                          |
| `EstadoCarrito`  | ACTIVO, COMPLETADO                                                                         |
| `EstadoPedido`   | PENDIENTE, CONFIRMADO, EN_PREPARACION, LISTO_RETIRO, DESPACHADO, ENTREGADO, CANCELADO      |
| `EstadoPago`     | PENDIENTE, APROBADO, RECHAZADO, CANCELADO, REEMBOLSADO                                     |
| `TipoEntrega`    | ENVIO, RETIRO                                                                              |
| `TipoMetodoPago` | TARJETA_CREDITO, TARJETA_DEBITO, TRANSFERENCIA_BANCARIA, EFECTIVO, BILLETERA_VIRTUAL, OTRO |

### Entidades

#### Usuario

| Campo        | Tipo     | Notas          |
| ------------ | -------- | -------------- |
| id           | Int (PK) | Autoincrement  |
| nombre       | String   | Requerido      |
| apellido     | String   | Requerido      |
| email        | String   | Unique         |
| passwordHash | String   | Hash bcrypt    |
| telefono     | String?  | Opcional       |
| role         | Role     | Default: USER  |
| activo       | Boolean  | Default: true  |
| createdAt    | DateTime | Default: now() |

#### Marca

| Campo       | Tipo     | Notas           |
| ----------- | -------- | --------------- |
| id          | Int (PK) | Autoincrement   |
| nombre      | String   | Unique          |
| descripcion | String?  | Opcional        |
| paisOrigen  | String?  | Ej: "Francia"   |
| activo      | Boolean  | Default: true   |
| logoUrl     | String?  | URL imagen logo |

#### Perfume

| Campo         | Tipo           | Notas                                |
| ------------- | -------------- | ------------------------------------ |
| id            | Int (PK)       | Autoincrement                        |
| marcaId       | Int (FK)       | -> Marca                             |
| categoriaId   | Int (FK)       | -> Categoria                         |
| nombre        | String         | Requerido                            |
| descripcion   | String?        | Familia olfativa, notas, descripción |
| concentracion | Concentracion? | EF, EDC, EDT, etc.                   |
| genero        | Genero         | HOMBRE, MUJER, UNISEX                |
| tipo          | String?        | designer, niche, arabic              |
| activo        | Boolean        | Default: true                        |
| imagenUrl     | String?        | URL imagen perfume                   |
| slug          | String         | Unique, URL-friendly                 |
| createdAt     | DateTime       | Default: now()                       |

#### Categoria

| Campo       | Tipo     | Notas                      |
| ----------- | -------- | -------------------------- |
| id          | Int (PK) | Autoincrement              |
| nombre      | String   | Ej: "Floreal", "Amaderada" |
| descripcion | String?  | Opcional                   |
| slug        | String   | Unique                     |

#### VariantePerfume

| Campo     | Tipo          | Notas                        |
| --------- | ------------- | ---------------------------- |
| id        | Int (PK)      | Autoincrement                |
| perfumeId | Int (FK)      | -> Perfume                   |
| volumen   | Int           | En ml (30, 50, 100, etc.)    |
| precio    | Decimal(10,2) | Precio en ARS                |
| stock     | Int           | Default: 0                   |
| sku       | String        | Unique, código identificador |
| activo    | Boolean       | Default: true                |

#### Carrito

| Campo     | Tipo          | Notas               |
| --------- | ------------- | ------------------- |
| id        | Int (PK)      | Autoincrement       |
| usuarioId | Int (FK)      | -> Usuario          |
| estado    | EstadoCarrito | ACTIVO o COMPLETADO |
| creadoAt  | DateTime      | Default: now()      |

#### ItemCarrito

| Campo          | Tipo                    | Notas                        |
| -------------- | ----------------------- | ---------------------------- |
| carritoId      | Int (FK)                | -> Carrito                   |
| varianteId     | Int (FK)                | -> VariantePerfume           |
| cantidad       | Int                     | Min: 1                       |
| precioUnitario | Decimal(10,2)           | Precio al momento de agregar |
| PK             | [carritoId, varianteId] | Compuesta                    |

#### Pedido

| Campo             | Tipo          | Notas                    |
| ----------------- | ------------- | ------------------------ |
| id                | Int (PK)      | Autoincrement            |
| usuarioId         | Int (FK)      | -> Usuario               |
| nroPedido         | String        | Unique, número de pedido |
| tipoEntrega       | TipoEntrega   | ENVIO o RETIRO           |
| subtotal          | Decimal(10,2) | Suma items               |
| costoEnvio        | Decimal(10,2) | Default: 0               |
| total             | Decimal(10,2) | subtotal + costoEnvio    |
| estado            | EstadoPedido  | Default: PENDIENTE       |
| fechaCreacion     | DateTime      | Default: now()           |
| observaciones     | String?       | Notas del cliente        |
| telefonoContacto  | String?       | Para envios              |
| direccionEnvio    | String?       | Calle y número           |
| ciudadEnvio       | String?       |                          |
| provinciaEnvio    | String?       |                          |
| codigoPostalEnvio | String?       |                          |

#### ItemPedido

| Campo          | Tipo                   | Notas                       |
| -------------- | ---------------------- | --------------------------- |
| pedidoId       | Int (FK)               | -> Pedido                   |
| varianteId     | Int (FK)               | -> VariantePerfume          |
| cantidad       | Int                    |                             |
| precioUnitario | Decimal(10,2)          | Precio al momento de compra |
| PK             | [pedidoId, varianteId] | Compuesta                   |

#### MetodoPago

| Campo  | Tipo           | Notas                      |
| ------ | -------------- | -------------------------- |
| id     | Int (PK)       | Autoincrement              |
| nombre | String         | Unique, ej: "Mercado Pago" |
| tipo   | TipoMetodoPago |                            |
| activo | Boolean        | Default: true              |

#### Pago

| Campo              | Tipo          | Notas                     |
| ------------------ | ------------- | ------------------------- |
| id                 | Int (PK)      | Autoincrement             |
| pedidoId           | Int (FK)      | -> Pedido                 |
| metodoPagoId       | Int (FK)      | -> MetodoPago             |
| usuarioId          | Int (FK)      | -> Usuario (quién inicia) |
| cuotas             | Int           | Default: 1                |
| monto              | Decimal(10,2) |                           |
| moneda             | String        | Default: "ARS"            |
| estado             | EstadoPago    | Default: PENDIENTE        |
| externalId         | String?       | ID de Mercado Pago        |
| externalStatus     | String?       | Estado externo            |
| paymentType        | String?       | Tipo de pago MP           |
| montoReembolso     | Decimal?      | Si se reembolsó           |
| fechaReembolso     | DateTime?     |                           |
| fechaCreacion      | DateTime      | Default: now()            |
| fechaActualizacion | DateTime      | @updatedAt                |

#### PagoEvento

| Campo          | Tipo        | Notas                        |
| -------------- | ----------- | ---------------------------- |
| id             | Int (PK)    | Autoincrement                |
| pagoId         | Int (FK)    | -> Pago                      |
| estadoAnterior | EstadoPago? | Null si es creación          |
| estadoNuevo    | EstadoPago  |                              |
| origen         | String      | WEBHOOK, MANUAL, SISTEMA     |
| payload        | Json?       | Datos originales del webhook |
| fecha          | DateTime    | Default: now()               |

---

## Notas de Implementación

### Stock

El stock se gestiona directamente en `VariantePerfume.stock`. No hay movimientos por ahora.

### Envíos

Los campos de envío están embebidos en `Pedido` para cuando se implemente la funcionalidad de delivery.

### Descuentos/Promociones

No hay campos de descuento en MVP. Se pueden agregar `precioOferta` en `VariantePerfume` cuando sea necesario.

### Pagos con Mercado Pago

`externalId` y `externalStatus` permiten guardar el ID de Mercado Pago y sincronizar estados via webhook.

---

## Para Futuras Fases

| Feature                | Modelo a agregar                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| Trazabilidad stock     | `MovimientoStock` (varianteId, tipo, cantidad, stockAnterior, stockNuevo, motivo)               |
| Envíos con seguimiento | `Logistica` (pedidoId, destinatario, tracking, empresa correo)                                  |
| Direcciones guardadas  | `Direccion` (usuarioId, calle, ciudad, provincia) + cambiar Pedido.direccionEnvio a direccionId |
| Líneas de perfume      | `Linea` (id, nombre, marcaId) + agregar lineaId en Perfume                                      |
| Acordes                | `Acorde` + relación N:N con Perfume                                                             |
| Reseñas                | `Resena` (usuarioId, perfumeId, calificacion, comentario, compraVerificada)                     |
| Carrito abandonado     | Agregar ABANDONADO a EstadoCarrito                                                              |
