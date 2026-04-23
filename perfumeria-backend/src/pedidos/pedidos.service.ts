import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { ActualizarEstadoPedidoDto } from './dto/actualizar-estado-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  private generateNroPedido(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PED-${timestamp}-${random}`;
  }

  async findByUsuario(usuarioId: number) {
    return this.prisma.pedido.findMany({
      where: { usuarioId },
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
      orderBy: { fechaCreacion: 'desc' },
    });
  }

  async findOne(id: number, usuarioId?: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
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

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    if (usuarioId && pedido.usuarioId !== usuarioId) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  async findByNroPedido(nroPedido: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { nroPedido },
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

    if (!pedido) {
      throw new NotFoundException(`Pedido ${nroPedido} no encontrado`);
    }

    return pedido;
  }

  async create(usuarioId: number, dto: CrearPedidoDto) {
    const carrito = await this.prisma.carrito.findFirst({
      where: { usuarioId, estado: 'ACTIVO' },
      include: { items: { include: { variante: true } } },
    });

    if (!carrito || carrito.items.length === 0) {
      throw new NotFoundException('El carrito está vacío');
    }

    const subtotal = carrito.items.reduce(
      (sum, item) => sum + Number(item.precioUnitario) * item.cantidad,
      0,
    );

    const nroPedido = this.generateNroPedido();

    const pedido = await this.prisma.pedido.create({
      data: {
        usuarioId,
        nroPedido,
        tipoEntrega: dto.tipoEntrega,
        subtotal,
        costoEnvio: dto.tipoEntrega === 'ENVIO' ? 1500 : 0,
        total: subtotal + (dto.tipoEntrega === 'ENVIO' ? 1500 : 0),
        estado: 'PENDIENTE',
        observaciones: dto.observaciones,
        telefonoContacto: dto.telefonoContacto,
        direccionEnvio: dto.direccionEnvio,
        ciudadEnvio: dto.ciudadEnvio,
        provinciaEnvio: dto.provinciaEnvio,
        codigoPostalEnvio: dto.codigoPostalEnvio,
        items: {
          create: carrito.items.map((item) => ({
            varianteId: item.varianteId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),
        },
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

    await this.prisma.carrito.update({
      where: { id: carrito.id },
      data: { estado: 'COMPLETADO' },
    });

    return pedido;
  }

  async updateEstado(id: number, dto: ActualizarEstadoPedidoDto) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return this.prisma.pedido.update({
      where: { id },
      data: { estado: dto.estado },
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

  async findAll() {
    return this.prisma.pedido.findMany({
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
      orderBy: { fechaCreacion: 'desc' },
    });
  }
}
