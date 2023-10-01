import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamooseModule } from './dynamoose/dynamoose.module';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DynamooseModule,
    KafkaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
