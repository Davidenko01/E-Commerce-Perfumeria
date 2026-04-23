import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AgregarItemCarritoDto } from './dto/agregar-item.dto';
import { ActualizarItemCarritoDto } from './dto/actualizar-item.dto';

@Injectable()
export class CarritoService {
  constructor(private prisma: PrismaService) {}

  async findByUsuario(usuarioId: number) {
    let carrito = await this.prisma.carrito.findFirst({
      where: {
        usuarioId,
        estado: 'ACTIVO',
      },
      include: {
        items: {
          include: {
            variante: {
              include: {
                perfume: {
                  include: {
                    marca: { select: { nombre: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!carrito) {
      carrito = await this.prisma.carrito.create({
        data: {
          usuarioId,
          estado: 'ACTIVO',
        },
        include: {
          items: {
            include: {
              variante: {
                include: {
                  perfume: {
                    include: {
                      marca: { select: { nombre: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return carrito;
  }

  async agregarItem(usuarioId: number, dto: AgregarItemCarritoDto) {
    const variante = await this.prisma.variantePerfume.findUnique({
      where: { id: dto.varianteId },
    });

    if (!variante) {
      throw new NotFoundException(
        `Variante con ID ${dto.varianteId} no encontrada`,
      );
    }

    const carrito = await this.findByUsuario(usuarioId);

    const itemExistente = await this.prisma.itemCarrito.findUnique({
      where: {
        carritoId_varianteId: {
          carritoId: carrito.id,
          varianteId: dto.varianteId,
        },
      },
    });

    if (itemExistente) {
      return this.prisma.itemCarrito.update({
        where: {
          carritoId_varianteId: {
            carritoId: carrito.id,
            varianteId: dto.varianteId,
          },
        },
        data: {
          cantidad: itemExistente.cantidad + dto.cantidad,
          precioUnitario: variante.precio,
        },
      });
    }

    return this.prisma.itemCarrito.create({
      data: {
        carritoId: carrito.id,
        varianteId: dto.varianteId,
        cantidad: dto.cantidad,
        precioUnitario: variante.precio,
      },
    });
  }

  async actualizarItem(
    usuarioId: number,
    varianteId: number,
    dto: ActualizarItemCarritoDto,
  ) {
    const carrito = await this.findByUsuario(usuarioId);

    const item = await this.prisma.itemCarrito.findUnique({
      where: {
        carritoId_varianteId: {
          carritoId: carrito.id,
          varianteId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item no encontrado en el carrito`);
    }

    return this.prisma.itemCarrito.update({
      where: {
        carritoId_varianteId: {
          carritoId: carrito.id,
          varianteId,
        },
      },
      data: {
        cantidad: dto.cantidad,
      },
    });
  }

  async quitarItem(usuarioId: number, varianteId: number) {
    const carrito = await this.findByUsuario(usuarioId);

    const item = await this.prisma.itemCarrito.findUnique({
      where: {
        carritoId_varianteId: {
          carritoId: carrito.id,
          varianteId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item no encontrado en el carrito`);
    }

    await this.prisma.itemCarrito.delete({
      where: {
        carritoId_varianteId: {
          carritoId: carrito.id,
          varianteId,
        },
      },
    });
  }

  async vaciarCarrito(usuarioId: number) {
    const carrito = await this.findByUsuario(usuarioId);

    await this.prisma.itemCarrito.deleteMany({
      where: { carritoId: carrito.id },
    });
  }
}
