import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

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

  @Patch()
  update() {
    return 'update post';
  }

  @Delete('/:postId')
  remove() {
    return 'deleted';
  }
}
