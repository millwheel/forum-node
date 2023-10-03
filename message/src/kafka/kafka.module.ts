import { Module, Global } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { NotificationService } from 'src/notification/notification.service';
import { DeduplicationService } from 'src/notification/deduplication.service';

@Global()
@Module({
  providers: [ConsumerService, NotificationService, DeduplicationService],
  exports: [ConsumerService],
})
export class KafkaModule {}
