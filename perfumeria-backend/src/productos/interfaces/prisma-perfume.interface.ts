import { Decimal } from '@prisma/client/runtime/client';
import { TipoNota, Concentracion, Genero } from '../../generated/prisma/enums';

export interface PrismaMarca {
  nombre: string;
}

export interface PrismaCategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  slug: string;
  activo: boolean;
}

export interface PrismaFamiliaOlfativa {
  nombre: string;
}

export interface PrismaVariante {
  id: number;
  perfumeId: number;
  volumen: number;
  precio: Decimal;
  precioComparativo: Decimal | null;
  etiquetaDescuento: string | null;
  inicioDescuento: Date | null;
  finDescuento: Date | null;
  stock: number;
  sku: string;
  activo: boolean;
}

export interface PrismaNota {
  nombre: string;
}

export interface PrismaPerfumeNota {
  tipoNota: TipoNota;
  nota: PrismaNota;
}

export interface PrismaPerfumeWithRelations {
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
  marcaId: number;
  categoriaId: number;
  familiaOlfativaId: number;
  createdAt: Date;
  updatedAt: Date;
  marca: PrismaMarca;
  categoria: PrismaCategoria;
  familiaOlfativa: PrismaFamiliaOlfativa;
  variantes: PrismaVariante[];
  perfumeNotas: PrismaPerfumeNota[];
}
