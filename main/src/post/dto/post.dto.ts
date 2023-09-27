import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  readonly postId: number;
  @IsNumber()
  readonly userId: number;
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
  @IsString({ each: true })
  readonly tagList: string[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  readonly title: string;
  @IsOptional()
  @IsString()
  readonly content: string;
  @IsOptional()
  @IsString({ each: true })
  readonly tagList: string[];
}

export class ResponsePostDto {
  writerId: number;
  title: string;
  content: string;
  tagList: string[];
}
