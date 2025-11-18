import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si aucun rôle n'est requis, on autorise l'accès
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.debug(`User object: ${JSON.stringify(user)}`);
    this.logger.debug(`Required roles: ${requiredRoles.join(', ')}`);
    
    if (!user) {
      this.logger.error('No user object found in request');
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.role) {
      this.logger.error('No role found in user object');
      throw new ForbiddenException('User role not found');
    }

    // Vérifier si le rôle de l'utilisateur est dans les rôles requis
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      this.logger.warn(`User with role ${user.role} is not authorized. Required roles: ${requiredRoles.join(', ')}`);
    }

    return hasRole;
  }
}
