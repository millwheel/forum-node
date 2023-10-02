import { Injectable } from '@nestjs/common';
import { Notification } from './notification.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DeduplicationService {
  constructor(private redisService: RedisService) {}

  async deduplicationMessage(
    postId: number,
    userId: number,
    title: string,
  ): Promise<boolean> {
    const messageId = postId + userId;
    const redisClient = this.redisService.getClient();
    if (await redisClient.exists(String(messageId))) {
      return false;
    }
    const notification = new Notification(messageId, title);
    console.log(
      `Memorize user id=${userId}, post id=${postId}, post title=${title}`,
    );
    await redisClient.set(String(messageId), JSON.stringify(notification));

    return true;
  }
}
