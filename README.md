# 🌸 Perfumería — E-commerce Showroom

Plataforma web para exhibición de productos de una perfumería local. Permite explorar el catálogo completo con filtros avanzados, buscador y la información del showroom para sacar turno.

> Proyecto en construcción — actualmente en Fase 2 (frontend).

---

## Tecnologías

**Frontend**
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) con [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query (React Query)](https://tanstack.com/query)
- [Axios](https://axios-http.com/)

**Backend**
- [NestJS](https://nestjs.com/) + TypeScript
- Datos mock (migración a PostgreSQL + Prisma planificada en Fase 3)

---

## Estructura del proyecto

```
/
├── perfumeria-backend/       # API REST con NestJS
│   └── src/
│       ├── products/         # Listado, filtros y búsqueda de perfumes
│       ├── brands/           # Marcas disponibles
│       └── showroom/         # Info de contacto del local
│
└── perfumeria-frontend/      # App React
    └── src/
        ├── components/       # Componentes reutilizables
        ├── pages/            # Páginas (catálogo, showroom)
        ├── services/         # Llamadas a la API
        ├── hooks/            # Custom hooks con React Query
        └── types/            # Interfaces TypeScript compartidas
```

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Lista todos los perfumes (acepta filtros) |
| GET | `/products/:id` | Detalle de un perfume |
| GET | `/brands` | Lista todas las marcas |
| GET | `/brands/:id` | Detalle de una marca |
| GET | `/showroom` | Info de contacto del local |

### Filtros disponibles en `/products`

| Parámetro | Tipo | Ejemplo |
|-----------|------|---------|
| `search` | string | `?search=chanel` |
| `brand` | string | `?brand=Dior` |
| `gender` | `man` \| `woman` \| `unisex` | `?gender=woman` |
| `type` | `designer` \| `niche` \| `arabic` | `?type=niche` |
| `minPrice` | number | `?minPrice=50000` |
| `maxPrice` | number | `?maxPrice=150000` |
| `onSale` | boolean | `?onSale=true` |
| `inStock` | boolean | `?inStock=true` |

---

## Instalación y uso local

### Requisitos

- Node.js 18 o superior
- npm

### Backend

```bash
cd perfumeria-backend
npm install
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.

### Frontend

```bash
cd perfumeria-frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Variables de entorno

Creá un archivo `.env` dentro de `perfumeria-frontend/`:

```
VITE_API_URL=http://localhost:3000
```

---

## Roadmap

- [x] **Fase 1** — Backend NestJS con datos mock y endpoints REST
- [ ] **Fase 2** — Frontend React: catálogo, filtros, buscador y página de showroom
- [ ] **Fase 3** — Base de datos real (PostgreSQL + Prisma) y upload de imágenes
- [ ] **Fase 4** — Carrito de compras, pagos (MercadoPago), panel admin y deploy

---

## Funcionalidades planeadas

- Catálogo con cards de perfumes (precio, stock, descuento)
- Filtros por marca, género, tipo, precio y descuento
- Buscador en tiempo real
- Página del showroom con dirección, teléfono, mail e Instagram
- (Futuro) Carrito y checkout con MercadoPago
- (Futuro) Panel de administración con autenticación JWT