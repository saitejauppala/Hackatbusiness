import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No explicit role enforced indicates open access to valid JWTs
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Current identity privileges restrict viewing this resource natively');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Permission denied! Requires privileges tied to schemas: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
