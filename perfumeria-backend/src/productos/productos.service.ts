import { Injectable, NotFoundException } from '@nestjs/common';
import { Genero, Concentracion, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPerfumeDto } from './dto/crear-perfume.dto';
import { ActualizarPerfumeDto } from './dto/actualizar-perfume.dto';
import { FiltrosPerfumeDto } from './dto/filtros-perfume.dto';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FiltrosPerfumeDto) {
    const where: Prisma.PerfumeWhereInput = {};

    if (filters.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: 'insensitive' } },
        { descripcion: { contains: filters.search, mode: 'insensitive' } },
        {
          marca: { nombre: { contains: filters.search, mode: 'insensitive' } },
        },
      ];
    }

    if (filters.marca) {
      where.marca = {
        nombre: { contains: filters.marca, mode: 'insensitive' },
      };
    }

    if (filters.genero) {
      where.genero = filters.genero as Genero;
    }

    if (filters.tipo) {
      where.tipo = filters.tipo;
    }

    if (filters.concentracion) {
      where.concentracion = filters.concentracion as Concentracion;
    }

    if (filters.categoriaId) {
      where.categoriaId = filters.categoriaId;
    }

    const perfumes = await this.prisma.perfume.findMany({
      where,
      include: {
        marca: { select: { id: true, nombre: true } },
        categoria: { select: { id: true, nombre: true } },
        variantes: {
          where: { activo: true },
          orderBy: { volumen: 'asc' },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    if (filters.minPrice || filters.maxPrice) {
      return perfumes.filter((p) => {
        const prices = p.variantes.map((v) => Number(v.precio));
        const minVariantPrice = Math.min(...prices);
        if (filters.minPrice && minVariantPrice < filters.minPrice)
          return false;
        if (filters.maxPrice && minVariantPrice > filters.maxPrice)
          return false;
        return true;
      });
    }

    return perfumes;
  }

  async findOne(id: number) {
    const perfume = await this.prisma.perfume.findUnique({
      where: { id },
      include: {
        marca: { select: { id: true, nombre: true } },
        categoria: { select: { id: true, nombre: true } },
        variantes: {
          where: { activo: true },
          orderBy: { volumen: 'asc' },
        },
      },
    });

    if (!perfume) {
      throw new NotFoundException(`Perfume con ID ${id} no encontrado`);
    }

    return perfume;
  }

  async create(dto: CrearPerfumeDto) {
    const { variantes, ...perfumeData } = dto;

    const slug = dto.slug || this.generateSlug(dto.nombre);

    return this.prisma.perfume.create({
      data: {
        ...perfumeData,
        slug,
        activo: true,
        variantes: {
          create: variantes.map((v) => ({
            volumen: v.volumen,
            precio: v.precio,
            stock: v.stock || 0,
            sku: v.sku,
            activo: true,
          })),
        },
      },
      include: {
        marca: { select: { id: true, nombre: true } },
        categoria: { select: { id: true, nombre: true } },
        variantes: true,
      },
    });
  }

  async update(id: number, dto: ActualizarPerfumeDto) {
    await this.findOne(id);

    const { variantes, ...perfumeData } = dto;

    return this.prisma.perfume.update({
      where: { id },
      data: {
        ...perfumeData,
        variantes: variantes
          ? {
              deleteMany: { perfumeId: id },
              create: variantes.map((v) => ({
                volumen: v.volumen,
                precio: v.precio,
                stock: v.stock || 0,
                sku: v.sku,
                activo: true,
              })),
            }
          : undefined,
      },
      include: {
        marca: { select: { id: true, nombre: true } },
        categoria: { select: { id: true, nombre: true } },
        variantes: true,
      },
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.prisma.perfume.update({
      where: { id },
      data: { activo: false },
    });
  }

  private generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
