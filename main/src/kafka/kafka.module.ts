import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Global()
@Module({})
export class KafkaModule implements OnModuleInit {
  private kafka: Kafka;
  private _producer: Producer;

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
    this._producer = this.kafka.producer();
  }

  get producer() {
    return this._producer;
  }
}
