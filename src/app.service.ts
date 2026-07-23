import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('API_KEY') private readonly apiKey: string,
    @Inject('TASKS') private readonly tasks: string[],
  ) {}

  getHello(): string {
    console.log('Tasks:', this.tasks);
    return `Hello World! My API Key is ${this.apiKey}`;
  }
}
