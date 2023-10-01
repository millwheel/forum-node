import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

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
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    try {
      const response = await this.producer.send(record);
      return response;
    } catch (error) {
      console.error('Error producing Kafka message:', error);
      throw error;
    }
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
