import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { UsuarioResponse } from './interfaces/user-response.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UsuarioResponse[]> {
    return this.prisma.usuario.findMany({
      where: { activo: true },
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        role: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number): Promise<UsuarioResponse> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        role: true,
        activo: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async create(dto: CrearUsuarioDto): Promise<UsuarioResponse> {
    const existing = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(`El email ${dto.email} ya está registrado`);
    }

    return this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        passwordHash: dto.passwordHash,
        telefono: dto.telefono,
        role: 'USER',
        activo: true,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        role: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  async update(
    id: number,
    dto: ActualizarUsuarioDto,
  ): Promise<UsuarioResponse> {
    await this.findOne(id);

    const updateData: Prisma.UsuarioUpdateInput = { ...dto };
    if (dto.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(dto.passwordHash, 10);
    }

    return this.prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        role: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
  }
}
