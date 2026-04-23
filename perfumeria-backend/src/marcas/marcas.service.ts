import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearMarcaDto } from './dto/crear-marca.dto';
import { ActualizarMarcaDto } from './dto/actualizar-marca.dto';
import { MarcaResponse } from './interfaces/marca-response.interface';

@Injectable()
export class MarcasService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<MarcaResponse[]> {
    return this.prisma.marca.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number): Promise<MarcaResponse> {
    const marca = await this.prisma.marca.findUnique({
      where: { id },
    });
    if (!marca) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }
    return marca;
  }

  async create(dto: CrearMarcaDto): Promise<MarcaResponse> {
    return this.prisma.marca.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        paisOrigen: dto.paisOrigen,
        logoUrl: dto.logoUrl,
        activo: true,
      },
    });
  }

  async update(id: number, dto: ActualizarMarcaDto): Promise<MarcaResponse> {
    await this.findOne(id);
    return this.prisma.marca.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.marca.update({
      where: { id },
      data: { activo: false },
    });
  }
}
