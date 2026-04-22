import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserSafe } from '@/users/interfaces/user-safe.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async register(registerDto: RegisterDto) {
        const { email, password, name } = registerDto;

        //Verifica si el correo ya está registrado
        const existingUser = await this.usersService.findByEmailSafe(email);
        if (existingUser) {
            throw new ConflictException('El correo ya está registrado');
        }   
        //Hashea la password antes de guardarla en la base de datos
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const createUserDto: CreateUserDto = {email, hashedPassword, name};
        // Crea el usuario con la contraseña hasheada
        const user: UserSafe = await this.usersService.create(createUserDto);
        const payload: JwtPayload = {sub: user.id, email: user.email, role: user.role};
        return {
            access_token: this.jwtService.sign(payload),
            user: user
        };

    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        //Verifica si el usuario existe
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        // Solo comparo la password si el usuario existe
        const passwordMatched:boolean = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload: JwtPayload = {sub: user.id, email: user.email, role: user.role};
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        };
    }
}
