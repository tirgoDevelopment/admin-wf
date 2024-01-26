import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Patch,
  UsePipes,
  ValidationPipe,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { DriverDto } from './driver.dto';
import { DriversService } from './drivers.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/v2/drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 2)) // Assuming you want to handle up to 10 files
  async createDriver(
    @UploadedFiles() files: any,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('email') email: string,
    @Body('citizenship') citizenship: string,
  ) {
   return this.driversService.createDriver(files, { firstName, lastName, phoneNumber, email, citizenship } )
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateDriver(@Body() updateDriverDto: DriverDto) {
    return this.driversService.updateDriver(updateDriverDto);
  }

  @Get('id')
  async getDriver(@Query('id') id: number) {
    return this.driversService.getDriverById(id);
  }

  @Get('all')
  async getAllDriver() {
    return this.driversService.getAllDrivers();
  }

  @Get('active')
  async getAllActiveDriver() {
    return this.driversService.getAllActiveDrivers();
  }

  @Get('non-active')
  async getAllNonActiveDriver() {
    return this.driversService.getAllNonActiveDrivers();
  }

  @Get('deleted')
  async getAllDeletedDriver() {
    return this.driversService.getAllDeletedDrivers();
  }

  @Delete()
  async deleteDriver(@Query('id') id: number) {
    return this.driversService.deleteDriver(id);
  }

  @Patch('block')
  async blockDriver(@Query('id') id: number) {
    return this.driversService.blockDriver(id);
  }

  @Patch('activate')
  async activateDriver(@Query('id') id: number) {
    return this.driversService.activateDriver(id);
  }
}