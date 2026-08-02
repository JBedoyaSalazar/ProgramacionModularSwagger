import { Module, Global } from '@nestjs/common';
import { Client } from 'pg';

const API_KEY = 'sdadsdsaddsa12312asdsa';
const API_KEY_PROD = 'PROD123';

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'user',
  password: 'password',
  database: 'platziStore',
});

client.connect();

@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      useValue: client,
    },
  ],
  exports: ['API_KEY', 'PG'],
})
export class DatabaseModule {}
