import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;
  @IsString({ each: true })
  readonly tagList: string[];
}

export class UpdateUserDto {
  @IsString({ each: true })
  readonly tagList: string[];
}
