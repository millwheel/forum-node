import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamooseModule } from './dynamoose/dynamoose.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [DynamooseModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
