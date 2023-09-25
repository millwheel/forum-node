import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAll() {
    return 'get all post';
  }

  @Get('/:postId')
  getOne() {
    return 'get a post';
  }

  @Post()
  create() {
    return 'create post';
  }

  @Patch('/:postId')
  update() {
    return 'update post';
  }

  @Delete('/:postId')
  remove() {
    return 'deleted';
  }
}
