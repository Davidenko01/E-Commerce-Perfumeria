import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPerfumeDto } from './dto/crear-perfume.dto';
import { ActualizarPerfumeDto } from './dto/actualizar-perfume.dto';
import { FiltrosPerfumeDto } from './dto/filtros-perfume.dto';
import { Prisma } from '../generated/prisma/client';
import { PerfumeMapper } from './mappers/perfume.mapper';
import {
  PerfumeResponse,
  PaginatedPerfumesResponse,
} from './interfaces/perfume-response.interface';

//Definición estructura del Includes para uso global
export const perfumeInclude = {
  marca: { select: { nombre: true, slug: true } },
  categoria: true,
  familiaOlfativa: { select: { nombre: true } },
  variantes: { where: { activo: true }, orderBy: { volumen: 'asc' } },
  perfumeNotas: {
    select: {
      tipoNota: true,
      nota: { select: { nombre: true } },
    },
    orderBy: { tipoNota: 'asc' },
  },
} satisfies Prisma.PerfumeInclude;

// Generacion del type exacto del perfume con relaciones usando la constante de include (lo hace Prisma automáticamente)
export type PrismaPerfumeWithRelations = Prisma.PerfumeGetPayload<{
  include: typeof perfumeInclude;
}>;

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async findRawOrFail(id: number): Promise<PrismaPerfumeWithRelations> {
    const perfume = await this.prisma.perfume.findUnique({
      where: { id },
      include: perfumeInclude,
    });

    if (!perfume)
      throw new NotFoundException(`Perfume con ID ${id} no encontrado`);

    return perfume;
  }

  async create(dto: CrearPerfumeDto): Promise<PerfumeResponse> {
    const slug = this.generateSlug(dto.nombre);

    const existing = await this.prisma.perfume.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`El slug '${slug}' ya existe`);

    await this.prisma.$transaction(async (tx) => {
      const created = await tx.perfume.create({
        data: {
          marcaId: dto.marcaId,
          categoriaId: dto.categoriaId,
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          concentracion: dto.concentracion,
          genero: dto.genero,
          familiaOlfativaId: dto.familiaOlfativaId,
          activo: dto.activo ?? true,
          imagenUrl: dto.imagenUrl,
          galeriaImagenes: dto.galeriaImagenes ?? [],
          slug,
          destacado: dto.destacado ?? false,
        },
      });

      if (dto.variantes?.length) {
        await tx.variantePerfume.createMany({
          data: dto.variantes.map((v) => ({
            perfumeId: created.id,
            volumen: v.volumen,
            precio: v.precio,
            precioComparativo: v.precioComparativo,
            etiquetaDescuento: v.etiquetaDescuento,
            inicioDescuento: v.inicioDescuento
              ? new Date(v.inicioDescuento)
              : null,
            finDescuento: v.finDescuento ? new Date(v.finDescuento) : null,
            stock: v.stock ?? 0,
            sku: v.sku,
            activo: v.activo ?? true,
          })),
        });
      }

      if (dto.notas?.length) {
        await tx.perfumeNota.createMany({
          data: dto.notas.map((n) => ({
            perfumeId: created.id,
            notaId: n.notaId,
            tipoNota: n.tipoNota,
          })),
        });
      }

      return created;
    });

    return this.findOne(
      (await this.prisma.perfume.findUniqueOrThrow({ where: { slug } })).id,
    );
  }

  async findAll(query: FiltrosPerfumeDto): Promise<PaginatedPerfumesResponse> {
    const where = this.buildWhereClause(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const [perfumes, total] = await this.prisma.$transaction([
      this.prisma.perfume.findMany({
        where,
        include: perfumeInclude,
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.perfume.count({ where }),
    ]);

    return {
      data: perfumes.map(PerfumeMapper.toResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<PerfumeResponse> {
    const perfume = await this.findRawOrFail(id);
    return PerfumeMapper.toResponse(perfume);
  }

  async findBySlug(slug: string): Promise<PerfumeResponse> {
    const base = await this.prisma.perfume.findUnique({ where: { slug } });
    if (!base)
      throw new NotFoundException(`Perfume con slug '${slug}' no encontrado`);
    return this.findOne(base.id);
  }

  async update(
    id: number,
    dto: ActualizarPerfumeDto,
  ): Promise<PerfumeResponse> {
    await this.findRawOrFail(id);

    if (dto.slug) {
      const slugTaken = await this.prisma.perfume.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (slugTaken)
        throw new ConflictException(`El slug '${dto.slug}' ya está en uso`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.perfume.update({
        where: { id },
        data: {
          marcaId: dto.marcaId,
          categoriaId: dto.categoriaId,
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          concentracion: dto.concentracion,
          genero: dto.genero,
          familiaOlfativaId: dto.familiaOlfativaId,
          activo: dto.activo,
          imagenUrl: dto.imagenUrl,
          galeriaImagenes: dto.galeriaImagenes,
          slug: dto.slug,
          destacado: dto.destacado,
        },
      });

      if (dto.variantes) {
        await tx.variantePerfume.deleteMany({ where: { perfumeId: id } });
        await tx.variantePerfume.createMany({
          data: dto.variantes.map((v) => ({
            perfumeId: id,
            volumen: v.volumen,
            precio: v.precio,
            precioComparativo: v.precioComparativo,
            etiquetaDescuento: v.etiquetaDescuento,
            inicioDescuento: v.inicioDescuento
              ? new Date(v.inicioDescuento)
              : null,
            finDescuento: v.finDescuento ? new Date(v.finDescuento) : null,
            stock: v.stock ?? 0,
            sku: v.sku,
            activo: v.activo ?? true,
          })),
        });
      }

      if (dto.notas) {
        await tx.perfumeNota.deleteMany({ where: { perfumeId: id } });
        await tx.perfumeNota.createMany({
          data: dto.notas.map((n) => ({
            perfumeId: id,
            notaId: n.notaId,
            tipoNota: n.tipoNota,
          })),
        });
      }
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findRawOrFail(id);
    await this.prisma.perfume.update({
      where: { id },
      data: { activo: false },
    });
  }

  async restore(id: number): Promise<PerfumeResponse> {
    await this.prisma.perfume.update({ where: { id }, data: { activo: true } });
    return this.findOne(id);
  }

  private buildWhereClause(query: FiltrosPerfumeDto): Prisma.PerfumeWhereInput {
    const where: Prisma.PerfumeWhereInput = { activo: true };

    if (query.search) {
      where.OR = [
        { nombre: { contains: query.search, mode: 'insensitive' } },
        { descripcion: { contains: query.search, mode: 'insensitive' } },
        { marca: { nombre: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    if (query.marca)
      where.marca = { nombre: { contains: query.marca, mode: 'insensitive' } };
    if (query.genero) where.genero = query.genero;
    if (query.concentracion) where.concentracion = query.concentracion;
    if (query.categoriaId) where.categoriaId = query.categoriaId;
    if (query.familiaOlfativaId)
      where.familiaOlfativaId = query.familiaOlfativaId;
    if (query.destacado !== undefined)
      where.destacado = query.destacado === 'true';

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const precioFilter: Prisma.DecimalFilter = {};
      if (query.minPrice !== undefined) precioFilter.gte = query.minPrice;
      if (query.maxPrice !== undefined) precioFilter.lte = query.maxPrice;
      where.variantes = { some: { precio: precioFilter, activo: true } };
    }

    return where;
  }
}
