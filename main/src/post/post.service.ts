import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostModel } from './entity/post.model';

@Injectable()
export class PostService {
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
    return { postId, writerId, title, content, tagList };
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
