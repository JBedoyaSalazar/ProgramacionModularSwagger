import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { env } from './config/env.interface';

import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService<env>,
  ) {}

  getHello(): string {
    const apiKey = this.configService.get('API_KEY', { infer: true });
    const dbName = this.configService.get('DB_NAME', { infer: true });
    const dbPort = this.configService.get('DB_PORT', { infer: true });
    console.log('NODE_ENV=', process.env.NODE_ENV);

    return `<h1>Hello World!</h1>
    API Key: ${apiKey} - DB Name: ${dbName} - DB Port: ${dbPort}`;
  }

  async getTasks() {
    const database = await this.databaseService.connect();
    const tasksCollection = await database.collection('tasks');
    return await tasksCollection.find().toArray();
  }
}
