import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UsePipes,
  ValidationPipe,
  Put,
  Query,
} from '@nestjs/common';
import { RoleDto } from './role.dto';
import { RolesService } from './roles.service';

@Controller('api/v2/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createRole(@Body() createRoleDto: RoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateRole(@Body() updateRoleDto: RoleDto) {
    return this.rolesService.updateRole(updateRoleDto);
  }

  @Get()
  async getRole(@Query('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  @Get('all')
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Get('permission')
  async getAllPermission() {
    return this.rolesService.getAllPermissions();
  }
}