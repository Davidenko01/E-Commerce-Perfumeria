export interface Marca {
  id: number;
  nombre: string;
  descripcion: string | null;
  paisOrigen: string | null;
  activo: boolean;
  logoUrl: string | null;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  slug: string;
}

export interface VariantePerfume {
  id: number;
  perfumeId: number;
  volumen: number;
  precio: number;
  stock: number;
  sku: string;
  activo: boolean;
}

export interface Perfume {
  id: number;
  marcaId: number;
  categoriaId: number;
  nombre: string;
  descripcion: string | null;
  concentracion: string | null;
  genero: "HOMBRE" | "MUJER" | "UNISEX";
  tipo: string | null;
  activo: boolean;
  imagenUrl: string | null;
  slug: string;
  createdAt: Date;
  marca?: {
    id: number;
    nombre: string;
  };
  categoria?: {
    id: number;
    nombre: string;
  };
  variantes?: VariantePerfume[];
}

export interface ProductoFiltros {
  search?: string;
  marca?: string;
  genero?: "HOMBRE" | "MUJER" | "UNISEX";
  tipo?: string;
  concentracion?: string;
  categoriaId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface CarritoItem {
  varianteId: number;
  cantidad: number;
  precioUnitario: number;
  variante: {
    id: number;
    volumen: number;
    precio: number;
    perfume: {
      id: number;
      nombre: string;
      imagenUrl: string | null;
      marca: {
        nombre: string;
      };
    };
  };
}

export interface Carrito {
  id: number;
  usuarioId: number;
  estado: "ACTIVO" | "COMPLETADO";
  creadoAt: Date;
  items: CarritoItem[];
}

export interface ItemPedido {
  varianteId: number;
  cantidad: number;
  precioUnitario: number;
  variante: {
    id: number;
    volumen: number;
    precio: number;
    perfume: {
      id: number;
      nombre: string;
      imagenUrl: string | null;
      marca: {
        nombre: string;
      };
    };
  };
}

export interface Pedido {
  id: number;
  usuarioId: number;
  nroPedido: string;
  tipoEntrega: "ENVIO" | "RETIRO";
  subtotal: number;
  costoEnvio: number;
  total: number;
  estado:
    | "PENDIENTE"
    | "CONFIRMADO"
    | "EN_PREPARACION"
    | "LISTO_RETIRO"
    | "DESPACHADO"
    | "ENTREGADO"
    | "CANCELADO";
  fechaCreacion: Date;
  observaciones: string | null;
  telefonoContacto: string | null;
  direccionEnvio: string | null;
  ciudadEnvio: string | null;
  provinciaEnvio: string | null;
  codigoPostalEnvio: string | null;
  items: ItemPedido[];
}

export interface Showroom {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  instagram: string;
  schedule: string;
}

export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  role: "ADMIN" | "USER";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface AgregarCarritoRequest {
  varianteId: number;
  cantidad: number;
}

export interface CrearPedidoRequest {
  tipoEntrega: "ENVIO" | "RETIRO";
  observaciones?: string;
  telefonoContacto?: string;
  direccionEnvio?: string;
  ciudadEnvio?: string;
  provinciaEnvio?: string;
  codigoPostalEnvio?: string;
}
