import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from '../decorators/public.decorators';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.header('pepeImagination');
    const isAuthorized = apiKey === '123456';

    if (!isAuthorized) {
      throw new UnauthorizedException('Unauthorized: Invalid API key');
    }

    return isAuthorized;
  }
}
