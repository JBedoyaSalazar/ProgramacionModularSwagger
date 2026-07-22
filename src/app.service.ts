import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('API_KEY') private readonly apiKey: string) {}

  getHello(): string {
    return `Hello World! My API Key is ${this.apiKey}`;
  }
}
