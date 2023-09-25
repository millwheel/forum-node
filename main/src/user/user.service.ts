import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }

  getOne(userId: number): User {
    const user = this.users.find((user) => user.userId == userId);
    if (!user) {
      throw new NotFoundException(`User with Id: ${userId} not found.`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const user = new User();
    user.userId = this.users.length + 1;
    user.username = createUserDto.username;
    user.tagList = createUserDto.tagList;
    user.token = '';
    this.users.push(user);
    return user;
  }

  update(userId: number, updateUserDto: UpdateUserDto): User {
    const user = this.getOne(userId);
    user.tagList = updateUserDto.tagList;
    return user;
  }

  deleteOne(userId: number): void {
    const userIndex = this.users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
      throw new NotFoundException(`User with Id: ${userId} not found.`);
    }
    this.users.splice(userIndex, 1);
  }
}
