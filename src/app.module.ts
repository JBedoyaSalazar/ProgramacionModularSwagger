import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

const API_KEY = 'sdadsdsaddsa12312asdsa';
const API_KEY_PROD = 'PROD123';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [AppController],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    AppService,
  ],
})
export class AppModule {}
