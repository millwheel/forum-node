import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';

@Global()
@Module({
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (configService: ConfigService) => {
        const kafka = new Kafka({
          clientId: 'nestjs-app',
          brokers: [configService.get<string>('CONFLUENT_BOOTSTRAP_SERVER')],
          sasl: {
            mechanism: 'plain',
            username: configService.get<string>('CONFLUENT_API_KEY'),
            password: configService.get<string>('CONFLUENT_API_SECRET'),
          },
          ssl: true,
        });
        const producer = kafka.producer();
        await producer.connect();
        return producer;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['KAFKA_PRODUCER'],
})
export class KafkaModule {}
