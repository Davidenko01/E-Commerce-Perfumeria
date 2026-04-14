import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const { email, password, name } = createUserDto;

        //Verifica si el correo ya está registrado
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('El correo ya está registrado');
        }   
        const salts = await bcrypt.genSalt();
        //Hashea la password antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, salts);
        
        return this.prisma.user.create({
            data: { email, password: hashedPassword, name },
            //Sin la contraseña en la respuesta
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({where: { email }});
    }
}