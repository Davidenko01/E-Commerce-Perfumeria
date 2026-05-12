import { Genero, Concentracion, TipoNota } from '../../generated/prisma/enums';

export interface CategoriaResponse {
  id: number;
  nombre: string;
  slug: string;
}

export interface MarcaResponse {
  id: number;
  nombre: string;
  slug: string;
}

export interface VarianteResponse {
  id: number;
  volumen: number;
  precio: number;
  precioComparativo: number | null;
  etiquetaDescuento: string | null;
  inicioDescuento: Date | null;
  finDescuento: Date | null;
  stock: number;
  sku: string;
}

export type NotasAgrupadasResponse = Partial<
  Record<Lowercase<TipoNota>, string[]>
>;

export interface PerfumeResponse {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  concentracion: Concentracion;
  genero: Genero;
  imagenUrl: string;
  galeriaImagenes: string[];
  destacado: boolean;
  activo: boolean;
  marca: MarcaResponse;
  categoria: CategoriaResponse;
  familiaOlfativa: string;
  notas: NotasAgrupadasResponse;
  variantes: VarianteResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedPerfumesResponse {
  data: PerfumeResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
