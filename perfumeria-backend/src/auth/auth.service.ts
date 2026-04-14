import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        //Verifica si el usuario existe y si la contraseña es correcta
        const user = await this.usersService.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = {sub: user.id, email: user.email, role: user.role};
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
