import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  readonly userId: number;
  @IsString()
  readonly username: string;
  @IsString({ each: true })
  readonly tagList: string[];
}

export class UpdateUserDto {
  @IsString({ each: true })
  readonly tagList: string[];
}
