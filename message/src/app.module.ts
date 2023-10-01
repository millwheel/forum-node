import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamooseModule } from './dynamoose/dynamoose.module';

@Module({
  imports: [DynamooseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
