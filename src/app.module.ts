import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './config/enviroments';
import { configSchema } from './config/configSchema';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || enviroments.dev,
      isGlobal: true,
      validationSchema: configSchema,
    }),
    UsersModule,
    ProductsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'TASKS',
      useFactory: async (httpService: HttpService) => {
        const tasks = await httpService
          .get('https://jsonplaceholder.typicode.com/todos')
          .toPromise();
        return tasks.data;
      },
      inject: [HttpService],
    },
    AppService,
  ],
})
export class AppModule {}
