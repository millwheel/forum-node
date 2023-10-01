import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ConsumerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly notificationService: NotificationService;

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
    this.consumer = this.kafka.consumer({ groupId: 'notification' });
    this.notificationService = new NotificationService();
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topics: ['forum_notification'] });
    await this.consumer.run({
      eachMessage: this.notificationService.messageConsume.bind(
        this.notificationService,
      ),
    });
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
