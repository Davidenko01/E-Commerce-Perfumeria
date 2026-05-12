import { TipoNota } from '../../generated/prisma/enums';
import { PrismaPerfumeWithRelations } from '../productos.service';
import {
  PerfumeResponse,
  VarianteResponse,
  NotasAgrupadasResponse,
  CategoriaResponse,
  MarcaResponse,
} from '../interfaces/perfume-response.interface';

// 2. Extraemos los tipos exactos de los arrays dinámicamente
type PerfumeVariante = PrismaPerfumeWithRelations['variantes'][number];
type PerfumeNota = PrismaPerfumeWithRelations['perfumeNotas'][number];

export class PerfumeMapper {
  static toResponse(perfume: PrismaPerfumeWithRelations): PerfumeResponse {
    return {
      id: perfume.id,
      slug: perfume.slug,
      nombre: perfume.nombre,
      descripcion: perfume.descripcion,
      concentracion: perfume.concentracion,
      genero: perfume.genero,
      imagenUrl: perfume.imagenUrl,
      galeriaImagenes: perfume.galeriaImagenes,
      destacado: perfume.destacado,
      activo: perfume.activo,
      marca: PerfumeMapper.mapMarca(perfume),
      categoria: PerfumeMapper.mapCategoria(perfume),
      familiaOlfativa: perfume.familiaOlfativa.nombre,
      notas: PerfumeMapper.groupNotas(perfume.perfumeNotas),
      variantes: perfume.variantes.map(PerfumeMapper.mapVariante),
      createdAt: perfume.createdAt,
      updatedAt: perfume.updatedAt,
    };
  }

  private static mapCategoria(
    perfume: PrismaPerfumeWithRelations,
  ): CategoriaResponse {
    return {
      id: perfume.categoria.id,
      nombre: perfume.categoria.nombre,
      slug: perfume.categoria.slug,
    };
  }

  private static mapMarca(perfume: PrismaPerfumeWithRelations): MarcaResponse {
    return {
      id: perfume.marcaId,
      nombre: perfume.marca.nombre,
      slug: perfume.marca.slug,
    };
  }

  // 3. Usamos el tipo extraído dinámicamente
  private static mapVariante(variante: PerfumeVariante): VarianteResponse {
    const { perfumeId, activo, precio, precioComparativo, ...rest } = variante;
    return {
      ...rest,
      precio: precio.toNumber(),
      precioComparativo: precioComparativo
        ? precioComparativo.toNumber()
        : null,
    };
  }

  // 4. Usamos el tipo extraído dinámicamente
  private static groupNotas(notas: PerfumeNota[]): NotasAgrupadasResponse {
    return notas.reduce<NotasAgrupadasResponse>((acc, { tipoNota, nota }) => {
      const key = tipoNota.toLowerCase() as Lowercase<TipoNota>;
      if (!acc[key]) acc[key] = [];
      acc[key].push(nota.nombre);
      return acc;
    }, {});
  }
}
