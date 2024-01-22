import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { CargoTypeGroupsService } from '../services/cargo-type-group.service';
import { CargoTypeGroupDto } from '../dtos/cargo-type-group.dto';

@Controller('api/v2/cargo-type-groups')
export class CargoTypeGroupsController {
  constructor(private readonly cargoTypeGroupsService: CargoTypeGroupsService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createCargoTypeGroup(@Body() createCargoTypeGroupDto: CargoTypeGroupDto) {
    return this.cargoTypeGroupsService.createCargoTypeGroup(createCargoTypeGroupDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateCargoTypeGroup(@Body() updateCargoTypeGroupDto: CargoTypeGroupDto) {
    return this.cargoTypeGroupsService.updateCargoTypeGroup(updateCargoTypeGroupDto);
  }

  @Get()
  async getCargoTypeGroup(@Query('id') id: string) {
    return this.cargoTypeGroupsService.getCargoTypeGroupById(id);
  }

  @Get('all')
  async getAllCargoTypeGroups() {
    console.log('add')
    return this.cargoTypeGroupsService.getAllCargoTypeGroups();
  }

  @Delete('')
  async deleteCargoTypeGroup(@Query('id') id: string) {
    return this.cargoTypeGroupsService.deleteCargoTypeGroup(id);
  }

}