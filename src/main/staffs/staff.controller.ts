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
import { UpdateStaffDto } from './staff.dto';
import { StaffsService } from './staffs.service';

@Controller('api/v2/staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) { }


  @Put()
  @UsePipes(ValidationPipe)
  async updateStaff(@Body() updateStaffDto: UpdateStaffDto) {
    return this.staffsService.updateStaff(updateStaffDto);
  }

  @Get()
  async getStaff(@Query('id') id: number) {
    return this.staffsService.getStaffById(id);
  }

  @Get('all')
  async getAllStaff() {
    return this.staffsService.getAllStaffs();
  }

  @Get('active')
  async getAllActiveStaff() {
    return this.staffsService.getAllActiveStaffs();
  }

  @Get('non-active')
  async getAllNonActiveStaff() {
    return this.staffsService.getAllNonActiveStaffs();
  }

  @Get('deleted')
  async getAllDeletedStaff() {
    return this.staffsService.getAllDeletedStaffs();
  }

  @Patch('delete')
  async deleteStaff(@Query('id') id: number) {
    return this.staffsService.deleteStaff(id);
  }

  @Patch('block')
  async blockStaff(@Query('id') id: number) {
    return this.staffsService.blockStaff(id);
  }

  @Patch('activate')
  async activateStaff(@Query('id') id: number) {
    return this.staffsService.activateStaff(id);
  }
}