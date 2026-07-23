import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    // @Inject('API_KEY') private readonly apiKey: string,
    // @Inject('TASKS') private readonly tasks: string[],
    private configService: ConfigService,
  ) {}

  getHello(): string {
    console.log('NODE_ENV=', process.env.NODE_ENV);

    return `Hello World! My API Key is ${this.configService.get(
      'API_KEY',
    )} and my DB Name is ${this.configService.get('DB_NAME')}`;
  }
}
