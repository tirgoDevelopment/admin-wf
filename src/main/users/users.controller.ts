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
import { UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('api/v2/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Put()
  @UsePipes(ValidationPipe)
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }

  @Get()
  async getUser(@Query('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Get('all')
  async getAllUser() {
    return this.usersService.getAllUsers();
  }

  @Get('active')
  async getAllActiveUser() {
    return this.usersService.getAllActiveUsers();
  }

  @Get('non-active')
  async getAllNonActiveUser() {
    return this.usersService.getAllNonActiveUsers();
  }

  @Get('deleted')
  async getAllDeletedUser() {
    return this.usersService.getAllDeletedUsers();
  }

  @Patch('delete')
  async deleteUser(@Query('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @Patch('block')
  async blockUser(@Query('id') id: number) {
    return this.usersService.blockUser(id);
  }

  @Patch('activate')
  async activateUser(@Query('id') id: number) {
    return this.usersService.activateUser(id);
  }
}