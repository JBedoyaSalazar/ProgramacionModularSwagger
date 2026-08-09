import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { env } from '../../config/env.interface';

export const jwtConfig = (
  configService: ConfigService<env>,
): JwtModuleOptions => {
  return {
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
  };
};
