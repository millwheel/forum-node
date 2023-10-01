import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class ConsumerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'nestjs-app',
      brokers: [configService.get<string>('CONFLUENT_BOOTSTRAP_SERVER')],
      sasl: {
        mechanism: 'plain',
        username: configService.get<string>('CONFLUENT_API_KEY'),
        password: configService.get<string>('CONFLUENT_API_SECRET'),
      },
      ssl: true,
    });
    this.consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
  }

  async onModuleInit() {
    await this.consumer.connect();
  }

  async consume(topic: string, eachMessage: (args: any) => Promise<void>) {
    await this.consumer.subscribe({ topic });
    await this.consumer.run({ eachMessage });
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
