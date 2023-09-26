import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAll() {
    return this.postService.getAll();
  }

  @Get('/:postId')
  getOne(@Param('postId') postId: number) {
    return this.postService.getOne(postId);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Patch('/:postId')
  update(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(postId, updatePostDto);
  }

  @Delete('/:postId')
  remove(@Param('postId') postId: number) {
    return this.postService.deleteOne(postId);
  }
}
