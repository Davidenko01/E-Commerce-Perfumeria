
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/interfaces/user.interface';
@Injectable()
export class RolesGuard implements CanActivate {
  //Reflector es una clase de NestJS que permite acceder a los metadatos definidos en los decoradores
  constructor(private reflector: Reflector) {}

  // Se busca que roles se requieren para acceder a la ruta usando el reflector y se comparan con los roles del usuario autenticado
  canActivate(context: ExecutionContext,): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no se requieren roles, se permite el acceso
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('No tienes permiso para acceder a este recurso');
    }

    return true;
  }
}
