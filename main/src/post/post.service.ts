import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostModel } from './entity/post.model';
import { TagModel } from 'src/user/entity/tag.model';
import { Producer } from 'kafkajs';
import { NotiMessageDto } from './dto/noti-message.dto';

@Injectable()
export class PostService {
  constructor(@Inject('KAFKA_PRODUCER') private readonly producer: Producer) {}

  async getAll() {
    const postInstances = await PostModel.scan().exec();
    const responsePostDtos = new Array();
    postInstances.map((post) => {
      const { postId, writerId, title, content, tagList } = post.toJSON();
      responsePostDtos.push({ postId, writerId, title, content, tagList });
    });
    return responsePostDtos;
  }

  async getOne(postId: number) {
    const postInstance = await PostModel.get(postId);
    const { writerId, title, content, tagList } = postInstance.toJSON();
    return { postId, writerId, title, content, tagList };
  }

  async create(createPostDto: CreatePostDto) {
    const postInstance = await PostModel.create({
      postId: createPostDto.postId,
      writerId: createPostDto.userId,
      title: createPostDto.title,
      content: createPostDto.content,
      tagList: createPostDto.tagList,
    });
    const { postId, writerId, title, content, tagList } = postInstance.toJSON();

    await this.processTagsAndNotify(tagList, postId, title);

    return { writerId, title, content, tagList };
  }

  private async processTagsAndNotify(
    tagList: string[],
    postId: number,
    title: string,
  ) {
    for (const tag of tagList) {
      const tagInstance = await TagModel.get(tag);
      if (tagInstance) {
        const { userIds } = tagInstance.toJSON();
        for (const userId of userIds) {
          await this.sendNotificationIdToKafka(postId, userId, title);
        }
      }
    }
  }

  private async sendNotificationIdToKafka(
    postId: number,
    userId: number,
    title: string,
  ) {
    await this.producer.connect();

    const notiMessage = new NotiMessageDto(userId, postId, title);
    const payload = JSON.stringify(notiMessage);

    const sendingResult = await this.producer.send({
      topic: 'forum_notification',
      messages: [{ value: payload }],
    });
    console.log(sendingResult);
  }

  async update(postId: number, updatePostDto: UpdatePostDto) {
    const postInstance = await PostModel.update({ postId }, updatePostDto);
    const { writerId, title, content, tagList } = postInstance.toJSON();
    return { postId, writerId, title, content, tagList };
  }

  async deleteOne(postId: number) {
    await PostModel.delete(postId);
  }
}
