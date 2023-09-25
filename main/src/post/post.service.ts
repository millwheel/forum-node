import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entity/post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  private posts: Post[] = [];

  getAll(): Post[] {
    return this.posts;
  }

  getOne(postId: number): Post {
    const post = this.posts.find((post) => post.postId === postId);
    return post;
  }

  create(createPostDto: CreatePostDto): Post {
    const post = new Post();
    post.postId = this.posts.length + 1;
    post.writerId = createPostDto.userId;
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.tagList = createPostDto.tagList;
    this.posts.push(post);
    return post;
  }

  update(postId: number, updatePostDto: UpdatePostDto): Post {
    const post = this.getOne(postId);
    const propertiesToUpdate = ['title', 'content', 'tagList'];
    propertiesToUpdate.forEach((prop) => {
      if (updatePostDto[prop] !== undefined) {
        post[prop] = updatePostDto[prop];
      }
    });
    return post;
  }

  deleteOne(postId: number): void {
    const postIndex = this.posts.findIndex((post) => post.postId === postId);
    if (postIndex === -1) {
      throw new NotFoundException(`User with Id: ${postId} not found.`);
    }
    this.posts.splice(postIndex, 1);
  }
}
