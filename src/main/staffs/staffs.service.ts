import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SundryService } from 'src/shared/services/sundry.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { BpmResponse, ResponseStauses, Role, User } from '..';
import { CreateStaffDto, UpdateStaffDto } from './staff.dto';
import { Staff } from './staff.entity';

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
        throw new Error('Create user failed');
      }

      newStaff.user = user;
      const resClient = await this.staffRepository.update({ id: staff.id }, newStaff);
      if(!resClient.affected) {
        await queryRunner.rollbackTransaction();
        throw new Error('Attach uesr to client failed');
      }

        // Commit the transaction
        await queryRunner.commitTransaction();
      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyCreated]);
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      if (err instanceof EntityNotFoundError) {
        // Staff not found
        return new BpmResponse(false, null, ['Role not Found']);
      } else {
        // Other error (handle accordingly)
        return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
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
      return new BpmResponse(false, null, [ResponseStauses.UpdateDataFailed]);
    }
  }

  async getStaffById(id: number): Promise<BpmResponse> {
    if(!id) {
      return new BpmResponse(false, null, ['Id id required']);
    }
    try {
      const staff = await this.staffRepository.findOneOrFail({ where: { id, deleted: false } });
      console.log(staff)
      if (!staff) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, staff, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
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
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, staffs, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async getAllActiveStaffs(): Promise<BpmResponse> {
    try {
      const staffs = await this.staffRepository.find({ where: { active: true, deleted: false } });
      if (!staffs.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, staffs, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async getAllNonActiveStaffs(): Promise<BpmResponse> {
    try {
      const staffs = await this.staffRepository.find({ where: { active: false, deleted: false } });
      if (!staffs.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, staffs, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async getAllDeletedStaffs(): Promise<BpmResponse> {
    try {
      const staffs = await this.staffRepository.find({ where: { deleted: true } });
      if (!staffs.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, staffs, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async deleteStaff(id: number): Promise<BpmResponse> {
    try {
      const staff = await this.staffRepository.findOneOrFail({ where: { id } });

      if (staff.deleted) {
        // Staff is already deleted
        return new BpmResponse(false, null, [ResponseStauses.AlreadyDeleted]);
      }

      const updateResult = await this.staffRepository.update({ id: staff.id }, { deleted: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        return new BpmResponse(false, null, [ResponseStauses.NotModified]);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Staff not found
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      } else {
        // Other error (handle accordingly)
        return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
      }
    }
  }

  async blockStaff(id: number): Promise<BpmResponse> {
    try {
      const staff = await this.staffRepository.findOneOrFail({ where: { id } });

      if (!staff.active) {
        // Staff is already blocked
        return new BpmResponse(false, null, [ResponseStauses.AlreadyBlocked]);
      }

      const updateResult = await this.staffRepository.update({ id: staff.id }, { active: false });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        return new BpmResponse(false, null, [ResponseStauses.NotModified]);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Staff not found
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      } else {
        // Other error (handle accordingly)
        return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
      }
    }
  }

  async activateStaff(id: number): Promise<BpmResponse> {
    try {
      const staff = await this.staffRepository.findOneOrFail({ where: { id } });

      if (staff.active) {
        // Staff is already blocked
        return new BpmResponse(false, null, [ResponseStauses.AlreadyActive]);
      }

      const updateResult = await this.staffRepository.update({ id: staff.id }, { active: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        return new BpmResponse(false, null, [ResponseStauses.NotModified]);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Staff not found
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      } else {
        // Other error (handle accordingly)
        return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
      }
    }
  }


}