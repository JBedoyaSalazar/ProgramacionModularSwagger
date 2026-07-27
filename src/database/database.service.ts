import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { env } from '../config/env.interface';
import { MongoClient } from 'mongodb';

@Injectable()
export class DatabaseService {
  private client: MongoClient;
  constructor(private readonly configService: ConfigService<env>) {
    this.client = new MongoClient(configService.get('DB_URI'));
  }

  async connect() {
    await this.client.connect();
    const database = this.client.db(this.configService.get('DB_NAME'));
    return database;
  }
}
