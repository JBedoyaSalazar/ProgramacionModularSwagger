import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { env } from './config/env.interface';

@Injectable()
export class AppService {
  constructor(
    // @Inject('API_KEY') private readonly apiKey: string,
    // @Inject('TASKS') private readonly tasks: string[],
    @Inject('PG') private readonly client: Client,
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

  async GetTasks() {
    return new Promise((resolve, reject) => {
      this.client.query('SELECT * FROM tasks', (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.rows);
        }
      });
    });
  }
}
