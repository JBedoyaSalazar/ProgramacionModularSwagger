import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Client } from 'pg';
import { env } from '../config/env.interface';

const API_KEY = 'sdadsdsaddsa12312asdsa';
const API_KEY_PROD = 'PROD123';

@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigService<env>) => {
        const client = new Client({
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
        });
        client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['API_KEY', 'PG'],
})
export class DatabaseModule {}
