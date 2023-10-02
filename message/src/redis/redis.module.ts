import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({})
export class RedisModule implements OnModuleInit {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');
    const username = this.configService.get<string>('REDIS_ACCESS_KEY');
    const password = this.configService.get<string>('REDIS_SECRET_KEY');

    this.redisClient = new Redis({ host, port, username, password });
  }
}
