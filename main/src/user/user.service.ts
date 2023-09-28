import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!userInstance) {
      new NotFoundException(`The user doesn't exist. (userId: ${userId})`);
    }
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
    if (!userInstance) {
      new NotFoundException(`The user doesn't exist. (userId: ${userId})`);
    }

    const existingTags = userInstance.tagList;
    const newTags = updateUserDto.tagList;

    const tagsToRemove = existingTags.filter((tag) => !newTags.includes(tag));
    const tagsToAdd = newTags.filter((tag) => !existingTags.includes(tag));

    await this.removeTagsForUser(userId, tagsToRemove);
    await this.updateTagsForUser(userId, tagsToAdd);

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

  private async removeTagsForUser(
    userId: number,
    tags: string[],
  ): Promise<void> {
    for (const tag of tags) {
      let tagEntity = await tagModel.get(tag);
      if (tagEntity) {
        const updatedUserIds = tagEntity.userId.filter((id) => id !== userId);
        if (updatedUserIds.length === 0) {
          await tagModel.delete(tag);
        } else {
          await tagModel.update({ tagName: tag }, { userId: updatedUserIds });
        }
      }
    }
  }

  async deleteOne(userId: number) {
    const userInstance = await UserModel.get(userId);
    if (!userInstance) {
      new NotFoundException(`The user doesn't exist. (userId: ${userId})`);
    }

    const { tagList } = userInstance.toJSON();
    for (const tag of tagList) {
      let tagEntity = await tagModel.get(tag);
      if (tagEntity) {
        const updatedUserIds = tagEntity.userId.filter((id) => id !== userId);

        if (updatedUserIds.length === 0) {
          await tagModel.delete(tag);
        } else {
          await tagModel.update({ tagName: tag }, { userId: updatedUserIds });
        }
      }
    }
    await UserModel.delete(userId);
  }
}
