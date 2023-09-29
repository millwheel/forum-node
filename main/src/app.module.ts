import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { DynamooseModule } from './dynamoose/dynamoose.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    PostModule,
    UserModule,
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
