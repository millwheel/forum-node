import { Injectable } from '@nestjs/common';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto/user.dto';
import { UserModel } from './entity/user.model';
import { tagModel } from './entity/tag.model';

@Injectable()
export class UserService {
  async getAll(): Promise<ResponseUserDto[]> {
    const userInstances = await UserModel.scan().exec();
    const responseUserDtos = new Array();
    userInstances.map((user) => {
      const { userId, username, tagList } = user.toJSON();
      responseUserDtos.push({ userId, username, tagList });
    });
    return responseUserDtos;
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

    await this.updateTagsForUser(createUserDto.userId, createUserDto.tagList);

    const { userId, username, tagList } = userInstance.toJSON();
    return { userId, username, tagList };
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const userInstance = await UserModel.update(
      { userId },
      { tagList: updateUserDto.tagList },
    );

    await this.updateTagsForUser(userId, updateUserDto.tagList);

    const { username, tagList } = userInstance.toJSON();
    return { userId, username, tagList };
  }

  private async updateTagsForUser(
    userId: number,
    tags: string[],
  ): Promise<void> {
    for (const tag of tags) {
      let tagEntity = await tagModel.get(tag);
      if (tagEntity) {
        if (!tagEntity.userId.includes(userId)) {
          tagEntity.userId.push(userId);
          await tagModel.update({ tagName: tag }, { userId: tagEntity.userId });
        }
      } else {
        await tagModel.create({ tagName: tag, userId: [userId] });
      }
    }
  }

  async deleteOne(userId: number) {
    await UserModel.delete(userId);
  }
}
