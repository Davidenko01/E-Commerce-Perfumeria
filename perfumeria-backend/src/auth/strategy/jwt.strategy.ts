
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PayloadEntity } from '../payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SUPER_SECRET_KEY',
    });
  }

  async validate(payload: PayloadEntity) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
