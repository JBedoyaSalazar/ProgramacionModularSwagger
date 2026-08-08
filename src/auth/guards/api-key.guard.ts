import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.header('pepeImagination');
    const isAuthorized = apiKey === '123456';

    if (!isAuthorized) {
      throw new UnauthorizedException('Unauthorized: Invalid API key');
    }

    return isAuthorized;
  }
}
