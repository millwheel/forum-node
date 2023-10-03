import { EachMessagePayload } from 'kafkajs';
import { DeduplicationService } from './deduplication.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private deduplicationService: DeduplicationService) {}

  messageConsume(payload: EachMessagePayload) {
    console.log('---kafka message arrived---');
    console.log(
      `topic: ${payload.topic}, Message:${payload.message.value.toString()}`,
    );

    const messageData = JSON.parse(payload.message.value.toString());

    const postId: number = messageData.postId;
    const userId: number = messageData.userId;
    const title: string = messageData.title;

    console.log(postId, userId, title);

    const result = this.deduplicationService.deduplicationMessage(
      postId,
      userId,
      title,
    );
    if (!result) {
      console.log('the message id already exists.');
    }
  }
}
