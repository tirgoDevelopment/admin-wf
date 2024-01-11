import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse, ResponseStauses } from '..';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { RoleDto } from './role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>
  ) { }

  async createRole(createRoleDto: RoleDto): Promise<BpmResponse> {
    const queryRunner = this.rolesRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role: Role = new Role();
      role.name = createRoleDto.name;
      role.description = createRoleDto.description;

      // Save role
      const savedRole = await queryRunner.manager.save(Role, role);

      // Create permission associated with the role
      const permission: Permission = new Permission();
      permission.role = savedRole; // Assuming there is a roleId property in the Permission entity
      permission.addDriver = createRoleDto.permission?.addDriver
      permission.addClient = createRoleDto.permission?.addClient
      permission.addOrder = createRoleDto.permission?.addOrder
      permission.cancelOrder = createRoleDto.permission?.cancelOrder
      permission.seeDriversInfo = createRoleDto.permission?.seeDriversInfo
      permission.seeClientsInfo = createRoleDto.permission?.seeClientsInfo
      permission.sendPush = createRoleDto.permission?.sendPush
      permission.chat = createRoleDto.permission?.chat
      permission.tracking = createRoleDto.permission?.tracking
      permission.driverFinance = createRoleDto.permission?.driverFinance
      permission.merchantFinance = createRoleDto.permission?.merchantFinance
      permission.registrMerchant = createRoleDto.permission?.registrMerchant
      permission.verifyDriver = createRoleDto.permission?.verifyDriver
      permission.merchantList = createRoleDto.permission?.merchantList
      console.log(permission, savedRole)
      // Save permission
      await queryRunner.manager.save(Permission, permission);

      await queryRunner.commitTransaction();

      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyCreated]);
    } catch (err: any) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      return new BpmResponse(false, null, [ResponseStauses.CreateDataFailed]);
    } finally {
      await queryRunner.release();
    }
  }

  async updateRole(updateRoleDto: RoleDto): Promise<BpmResponse> {
    const queryRunner = this.rolesRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the existing role 
      const existingRole = await queryRunner.manager.findOne(Role, { where: { id: updateRoleDto.id } });

      if (!existingRole) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }

      // Update role properties
      existingRole.name = updateRoleDto.name;
      existingRole.description = updateRoleDto.description;

      // Save updated role
      const updatedRole = await queryRunner.manager.save(Role, existingRole);

      // Find the associated permission
      const existingPermission = await queryRunner.manager.findOne(Permission, {
        where: { role: { id: updatedRole.id } },
      });

      if (!existingPermission) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }

      // Update permission properties
      existingPermission.addDriver = true; // Update other permission properties based on your requirements

      // Save updated permission
      await queryRunner.manager.save(Permission, existingPermission);

      await queryRunner.commitTransaction();

      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      return new BpmResponse(false, null, [ResponseStauses.UpdateDataFailed]);
    } finally {
      await queryRunner.release();
    }
  }

  async getRoleById(id: string): Promise<BpmResponse> {
    try {
      const role = await this.rolesRepository.findOneOrFail({ where: { id, deleted: false } });
      if (!role) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, role, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }

  async getAllRoles(): Promise<BpmResponse> {
    try {
      const roles = await this.rolesRepository.find({ where: { deleted: false }, relations: ['permission'] });
      if (!roles.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, roles, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }


  async getAllPermissions(): Promise<BpmResponse> {
    try {
      const permissions = await this.permissionsRepository.find({ where: { deleted: false } });
      if (!permissions.length) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return new BpmResponse(true, permissions, null);
    } catch (err: any) {
      return new BpmResponse(false, null, [ResponseStauses.NotFound]);
    }
  }
}