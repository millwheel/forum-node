import { Module, Global, OnModuleInit } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({})
export class DynamooseModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}
  onModuleInit() {
    const client = new DynamoDB({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
      region: this.configService.get<string>('AWS_REGION'),
    });

    dynamoose.aws.ddb.set(client);
  }
}
