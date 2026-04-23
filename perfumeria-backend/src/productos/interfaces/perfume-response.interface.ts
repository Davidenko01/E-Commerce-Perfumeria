export interface PerfumeResponse {
  id: number;
  marcaId: number;
  categoriaId: number;
  nombre: string;
  descripcion: string | null;
  concentracion: string | null;
  genero: string;
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
  variantes?: VariantePerfumeResponse[];
}

export interface VariantePerfumeResponse {
  id: number;
  perfumeId: number;
  volumen: number;
  precio: number;
  stock: number;
  sku: string;
  activo: boolean;
}
