import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCategoriaDto } from './dto/crear-categoria.dto';
import { ActualizarCategoriaDto } from './dto/actualizar-categoria.dto';
import { CategoriaResponse } from './interfaces/categoria-response.interface';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CategoriaResponse[]> {
    return this.prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number): Promise<CategoriaResponse> {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  async findBySlug(slug: string): Promise<CategoriaResponse> {
    const categoria = await this.prisma.categoria.findUnique({
      where: { slug },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría con slug ${slug} no encontrada`);
    }
    return categoria;
  }

  async create(dto: CrearCategoriaDto): Promise<CategoriaResponse> {
    return this.prisma.categoria.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        slug: dto.slug,
      },
    });
  }

  async update(
    id: number,
    dto: ActualizarCategoriaDto,
  ): Promise<CategoriaResponse> {
    await this.findOne(id);
    return this.prisma.categoria.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.categoria.delete({
      where: { id },
    });
  }
}
