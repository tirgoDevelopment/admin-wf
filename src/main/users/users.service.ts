import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { BpmResponse, ResponseStauses } from '..';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {

  }

  async getAllUsers(): Promise<BpmResponse> {
    try {
      const users: User[] = await this.usersRepository.find({ relations: ['client', 'driver'] });
      if(users.length) {
        return new BpmResponse(true, users, []);
      } else {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.InternalServerError])
    }
  }
}
