import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserSafe } from './interfaces/user-safe.interface';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<UserSafe> {
        return this.prisma.user.create({
            data: createUserDto,
            //Sin la contraseña en la respuesta
            select: { id: true, email: true, name: true, role: true }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({where: { email }});
    }

    async findByEmailSafe(email: string): Promise<UserSafe | null> {
        return this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, role: true }
        });
    }

    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({where: { id }});
    }
}