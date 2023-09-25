import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly userId: number;
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
  @IsString({ each: true })
  readonly tagList: string[];
}

export class UpdatePostDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
  @IsString({ each: true })
  readonly tagList: string[];
}
