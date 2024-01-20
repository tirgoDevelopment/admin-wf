import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SundryService } from 'src/shared/services/sundry.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { BpmResponse, ResponseStauses, Role, User } from '..';
import { CreateStaffDto, UpdateStaffDto } from './staff.dto';
import { Staff } from './staff.entity';
import { InternalErrorException } from 'src/shared/exceptions/internal.exception';
import { NoContentException } from 'src/shared/exceptions/no-content.exception';
import { BadRequestException } from 'src/shared/exceptions/bad-request.exception';
import { NotFoundException } from '../../shared/exceptions/not-found.exception';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(Staff) private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private sundriesService: SundryService
  ) { }

  async createStaff(createStaffDto: CreateStaffDto): Promise<BpmResponse> {
    const queryRunner = this.staffRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const passwordHash = await this.sundriesService.generateHashPassword(createStaffDto.password);
      const role = await this.rolesRepository.findOneOrFail({ where: { id: createStaffDto.roleId } });
      const staff: Staff = new Staff();
      staff.fullName = createStaffDto.fullName;
      staff.phone = createStaffDto.phone;
      staff.username = createStaffDto.username;
      staff.role = role;
      staff.password = passwordHash;

      const newStaff = await this.staffRepository.save(staff);

      const user = await this.usersRepository.save({ userType: 'staff', client: newStaff });
      if(!user) {
        await queryRunner.rollbackTransaction(); 
        throw new InternalErrorException(ResponseStauses.CreateDataFailed);
      }

      newStaff.user = user;
      const resClient = await this.staffRepository.update({ id: staff.id }, newStaff);
      if(!resClient.affected) {
        await queryRunner.rollbackTransaction();
        throw new InternalErrorException(ResponseStauses.InternalServerError, 'Attach uesr to client failed');
      }

        // Commit the transaction
        await queryRunner.commitTransaction();
      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyCreated]);
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      if (err.name === "EntityNotFoundError") {
        // Staff not found
       throw new NoContentException();
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }

  async updateStaff(updateStaffDto: UpdateStaffDto): Promise<BpmResponse> {
    try {
      const staff = await this.staffRepository.findOneOrFail({ where: { id: updateStaffDto.id } });
      const role = await this.rolesRepository.findOneOrFail({ where: { id: updateStaffDto.roleId } });
      staff.fullName = updateStaffDto.fullName;
      staff.phone = updateStaffDto.phone;
      staff.username = updateStaffDto.username;
      staff.role = role;
      await this.staffRepository.update({ id: staff.id }, staff);
      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
    } catch (err: any) {
      if (err.name === "EntityNotFoundError") {
        if(err.message.includes('rolesRepository')) {
          throw new NotFoundException(ResponseStauses.RoleNotFound);
        }
        if(err.message.includes('staffRepository')) {
          throw new NotFoundException(ResponseStauses.StaffNotFound);
        }
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }

  async getStaffById(id: number): Promise<BpmResponse> {
    if(!id) {
      throw new BadRequestException(ResponseStauses.IdIsRequired);
    }
    try {
      const staff = await this.staffRepository.findOneOrFail({ where: { id, deleted: false } });
      return new BpmResponse(true, staff, null);
    } catch (err: any) {
      if(err.name == 'EntityNotFoundError') {
        throw new NoContentException();
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async findByUsername(username: string) {
    try {
      const staff = await this.staffRepository.findOneOrFail({ where: { username, deleted: false } });
      return staff
    } catch (err: any) {
      return null;
    }
  }

  async findById(id: number) {
    try {
      const staff = await this.staffRepository.findOneOrFail({ where: { id, deleted: false } });
      return staff
    } catch (err: any) {
      return null;
    }
  }

  async getAllStaffs(): Promise<BpmResponse> {
    try {
      const staffs = await this.staffRepository.find({ where: { deleted: false }, relations: ['role', 'role.permission'] });
      if (!staffs.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, staffs, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async getAllActiveStaffs(): Promise<BpmResponse> {
    try {
      const staffs = await this.staffRepository.find({ where: { active: true, deleted: false } });
      if (!staffs.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, staffs, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async getAllNonActiveStaffs(): Promise<BpmResponse> {
    try {
      const staffs = await this.staffRepository.find({ where: { active: false, deleted: false } });
      if (!staffs.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, staffs, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async getAllDeletedStaffs(): Promise<BpmResponse> {
    try {
      const staffs = await this.staffRepository.find({ where: { deleted: true } });
      if (!staffs.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, staffs, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async deleteStaff(id: number): Promise<BpmResponse> {
    try {
      if(!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const staff = await this.staffRepository.findOneOrFail({ where: { id } });

      if (staff.deleted) {
        // Staff is already deleted 
        throw new BadRequestException(ResponseStauses.AlreadyDeleted);
      }

      const updateResult = await this.staffRepository.update({ id: staff.id }, { deleted: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Staff not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async blockStaff(id: number): Promise<BpmResponse> {
    try {
      if(!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const staff = await this.staffRepository.findOneOrFail({ where: { id } });

      if (!staff.active) {
        // Staff is already blocked
          throw new BadRequestException(ResponseStauses.AlreadyBlocked);
      }

      const updateResult = await this.staffRepository.update({ id: staff.id }, { active: false });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Staff not found
        throw new NoContentException()
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }

  async activateStaff(id: number): Promise<BpmResponse> {
    try {
      if(!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const staff = await this.staffRepository.findOneOrFail({ where: { id } });

      if (staff.active) {
        // Staff is already blocked
        throw new BadRequestException(ResponseStauses.AlreadyActive);
      }

      const updateResult = await this.staffRepository.update({ id: staff.id }, { active: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Staff not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }


}