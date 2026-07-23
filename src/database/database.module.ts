import { Module, Global } from '@nestjs/common';

const API_KEY = 'sdadsdsaddsa12312asdsa';
const API_KEY_PROD = 'PROD123';

@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
  ],
  exports: ['API_KEY'],
})
export class DatabaseModule {}
