import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto/user.dto';
import { UserModel } from './entity/user.model';

@Injectable()
export class UserService {
  async getAll(): Promise<ResponseUserDto[]> {
    const userInstances = await UserModel.scan().exec();
    return userInstances.map((user) => {
      const { userId, username, tagList } = user.toJSON();
      return { userId, username, tagList };
    });
  }

  async getOne(userId: number): Promise<ResponseUserDto> {
    const userInstance = await UserModel.get(userId);
    const { username, tagList } = userInstance.toJSON();
    return { userId, username, tagList };
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const userInstance = await UserModel.create({
      userId: createUserDto.userId,
      username: createUserDto.username,
      tagList: createUserDto.tagList,
      token: '',
    });
    const { userId, username, tagList } = userInstance.toJSON();
    return { userId, username, tagList };
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const userInstance = await UserModel.update({
      userId: userId,
      tagList: updateUserDto.tagList,
    });
    const { username, tagList } = userInstance.toJSON();
    return { userId, username, tagList };
  }

  async deleteOne(userId: number) {
    await UserModel.delete(userId);
  }
}
