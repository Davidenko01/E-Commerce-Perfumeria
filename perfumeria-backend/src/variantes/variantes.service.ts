import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { UpdateVarianteDto } from './dto/update-variante.dto';

@Injectable()
export class VariantesService {
  constructor(private prisma: PrismaService) {}

  async create(createVarianteDto: CreateVarianteDto) {
    const existeVariante = await this.prisma.variantePerfume.findFirst({
      where: {
        perfumeId: createVarianteDto.perfumeId,
        volumen: createVarianteDto.volumen,
      },
    });

    if (existeVariante) {
      throw new BadRequestException(
        `Ya existe una variante con perfumeId ${createVarianteDto.perfumeId} y volumen ${createVarianteDto.volumen}ml`,
      );
    }

    const skuExists = await this.prisma.variantePerfume.findUnique({
      where: { sku: createVarianteDto.sku },
    });

    if (skuExists) {
      throw new BadRequestException(
        `El SKU ${createVarianteDto.sku} ya está en uso`,
      );
    }

    return this.prisma.variantePerfume.create({
      data: {
        perfumeId: createVarianteDto.perfumeId,
        volumen: createVarianteDto.volumen,
        precio: createVarianteDto.precio,
        stock: createVarianteDto.stock ?? 0,
        sku: createVarianteDto.sku,
        activo: true,
      },
      include: {
        perfume: {
          select: {
            id: true,
            nombre: true,
            marca: { select: { id: true, nombre: true } },
          },
        },
      },
    });
  }

  async findAll(filters?: { perfumeId?: number; activo?: boolean }) {
    const where: Prisma.VariantePerfumeWhereInput = {};

    if (filters?.perfumeId) {
      where.perfumeId = filters.perfumeId;
    }

    if (filters?.activo !== undefined) {
      where.activo = filters.activo;
    }

    return this.prisma.variantePerfume.findMany({
      where,
      include: {
        perfume: {
          select: {
            id: true,
            nombre: true,
            marca: { select: { id: true, nombre: true } },
          },
        },
      },
      orderBy: [{ perfume: { nombre: 'asc' } }, { volumen: 'asc' }],
    });
  }

  async findOne(id: number) {
    const variante = await this.prisma.variantePerfume.findUnique({
      where: { id },
      include: {
        perfume: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            marca: { select: { id: true, nombre: true } },
            categoria: { select: { id: true, nombre: true } },
          },
        },
      },
    });

    if (!variante) {
      throw new NotFoundException(`Variante con ID ${id} no encontrada`);
    }

    return variante;
  }

  async findBySku(sku: string) {
    const variante = await this.prisma.variantePerfume.findUnique({
      where: { sku },
      include: {
        perfume: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            marca: { select: { id: true, nombre: true } },
          },
        },
      },
    });

    if (!variante) {
      throw new NotFoundException(`Variante con SKU ${sku} no encontrada`);
    }

    return variante;
  }

  async update(id: number, updateVarianteDto: UpdateVarianteDto) {
    const variante = await this.findOne(id);

    if (updateVarianteDto.sku && updateVarianteDto.sku !== variante.sku) {
      const skuExists = await this.prisma.variantePerfume.findFirst({
        where: { sku: updateVarianteDto.sku, NOT: { id } },
      });

      if (skuExists) {
        throw new BadRequestException(
          `El SKU ${updateVarianteDto.sku} ya está en uso`,
        );
      }
    }

    if (
      updateVarianteDto.perfumeId !== undefined &&
      updateVarianteDto.volumen !== undefined
    ) {
      const existeVariante = await this.prisma.variantePerfume.findFirst({
        where: {
          perfumeId: updateVarianteDto.perfumeId,
          volumen: updateVarianteDto.volumen,
          NOT: { id },
        },
      });

      if (existeVariante) {
        throw new BadRequestException(
          `Ya existe una variante con perfumeId ${updateVarianteDto.perfumeId} y volumen ${updateVarianteDto.volumen}ml`,
        );
      }
    }

    return this.prisma.variantePerfume.update({
      where: { id },
      data: updateVarianteDto,
      include: {
        perfume: {
          select: {
            id: true,
            nombre: true,
            marca: { select: { id: true, nombre: true } },
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.variantePerfume.update({
      where: { id },
      data: { activo: false },
    });
  }

  async activate(id: number) {
    await this.findOne(id);

    return this.prisma.variantePerfume.update({
      where: { id },
      data: { activo: true },
    });
  }

  async updateStock(id: number, cantidad: number) {
    const variante = await this.findOne(id);

    const nuevoStock = variante.stock + cantidad;

    if (nuevoStock < 0) {
      throw new BadRequestException(
        `Stock insuficiente. Actual: ${variante.stock}, Intentado: ${cantidad}`,
      );
    }

    return this.prisma.variantePerfume.update({
      where: { id },
      data: { stock: nuevoStock },
    });
  }
}
