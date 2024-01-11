import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SundryService } from 'src/shared/services/sundry.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { BpmResponse, ResponseStauses, Role } from '..';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    private sundriesService: SundryService
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<BpmResponse> {
    try {
      const passwordHash = await this.sundriesService.generateHashPassword(createUserDto.password);
      const role = await this.rolesRepository.findOneOrFail({ where: { id: createUserDto.roleId } });
      const user: User = new User();
      user.fullName = createUserDto.fullName;
      user.phone = createUserDto.phone;
      user.username = createUserDto.username;
      user.role = role;
      user.password = passwordHash;

      await this.userRepository.save(user);
      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyCreated]);
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // User not found
        return new BpmResponse(false, null, ['Role not Found']);
      } else {
        // Other error (handle accordingly)
        return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
      }
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<BpmResponse> {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id: updateUserDto.id } });
      const role = await this.rolesRepository.findOneOrFail({ where: { id: updateUserDto.roleId } });
      user.fullName = updateUserDto.fullName;
      user.phone = updateUserDto.phone;
      user.username = updateUserDto.username;
      user.role = role;
      await this.userRepository.update({ id: user.id }, user);
      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.UpdateDataFailed]);
    }
  }

  async getUserById(id: number): Promise<BpmResponse> {
    if(!id) {
      return new BpmResponse(false, null, ['Id id required']);
    }
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id, deleted: false } });
      console.log(user)
      if (!user) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, user, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { username, deleted: false } });
      return user
    } catch (err: any) {
      return null;
    }
  }

  async findById(id: number) {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id, deleted: false } });
      return user
    } catch (err: any) {
      return null;
    }
  }

  async getAllUsers(): Promise<BpmResponse> {
    try {
      const users = await this.userRepository.find({ where: { deleted: false }, relations: ['role', 'role.permission'] });
      if (!users.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, users, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async getAllActiveUsers(): Promise<BpmResponse> {
    try {
      const users = await this.userRepository.find({ where: { active: true, deleted: false } });
      if (!users.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, users, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async getAllNonActiveUsers(): Promise<BpmResponse> {
    try {
      const users = await this.userRepository.find({ where: { active: false, deleted: false } });
      if (!users.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, users, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async getAllDeletedUsers(): Promise<BpmResponse> {
    try {
      const users = await this.userRepository.find({ where: { deleted: true } });
      if (!users.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, users, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async deleteUser(id: number): Promise<BpmResponse> {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id } });

      if (user.deleted) {
        // User is already deleted
        return new BpmResponse(false, null, [ResponseStauses.AlreadyDeleted]);
      }

      const updateResult = await this.userRepository.update({ id: user.id }, { deleted: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        return new BpmResponse(false, null, [ResponseStauses.NotModified]);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // User not found
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      } else {
        // Other error (handle accordingly)
        return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
      }
    }
  }

  async blockUser(id: number): Promise<BpmResponse> {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id } });

      if (!user.active) {
        // User is already blocked
        return new BpmResponse(false, null, [ResponseStauses.AlreadyBlocked]);
      }

      const updateResult = await this.userRepository.update({ id: user.id }, { active: false });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        return new BpmResponse(false, null, [ResponseStauses.NotModified]);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // User not found
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      } else {
        // Other error (handle accordingly)
        return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
      }
    }
  }

  async activateUser(id: number): Promise<BpmResponse> {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id } });

      if (user.active) {
        // User is already blocked
        return new BpmResponse(false, null, [ResponseStauses.AlreadyActive]);
      }

      const updateResult = await this.userRepository.update({ id: user.id }, { active: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        return new BpmResponse(false, null, [ResponseStauses.NotModified]);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // User not found
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      } else {
        // Other error (handle accordingly)
        return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
      }
    }
  }


}