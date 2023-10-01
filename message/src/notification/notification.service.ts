import { EachMessagePayload } from 'kafkajs';

export class NotificationService {
  messageConsume(payload: EachMessagePayload) {
    console.log('---kafka message arrived---');
    console.log(
      `topic: ${payload.topic}, Message:${payload.message.value.toString()}`,
    );
  }
}
