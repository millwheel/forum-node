import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';

@Global()
@Module({})
export class KafkaModule implements OnModuleInit {
  private kafka: Kafka;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'nestjs-app',
      brokers: [this.configService.get<string>('CONFLUENT_BOOTSTRAP_SERVER')],
      sasl: {
        mechanism: 'plain',
        username: this.configService.get<string>('CONFLUENT_API_KEY'),
        password: this.configService.get<string>('CONFLUENT_API_SECRET'),
      },
      ssl: true,
    });
  }

  get producer() {
    return this.kafka.producer();
  }
}
