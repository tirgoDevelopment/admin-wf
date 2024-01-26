import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Query,
    Delete,
    UseInterceptors,
    UploadedFiles,
  } from '@nestjs/common';
  import { FilesInterceptor } from '@nestjs/platform-express';
import { TransportsService } from './transport.service';
  
  @Controller('api/v2/drivers')
  export class TransportsController {
    constructor(private readonly transportsService: TransportsService) { }
  
    @Post('transport')
    @UseInterceptors(FilesInterceptor('files')) // Assuming you want to handle up to 10 files
    async addTransport(
      @UploadedFiles() files: any,
      @Body('name') name: string,   
      @Body('driverId') driverId: number,     
      @Body('transportTypeId') transportTypeId: string, 
      @Body('description') description: string, 
      @Body('cubicCapacity') cubicCapacity: string, 
      @Body('stateNumber') stateNumber: string,     
      @Body('isAdr') isAdr: boolean,
    ) {
      return this.transportsService.addTransport(files, { name, transportTypeId, driverId, description, cubicCapacity, stateNumber, isAdr })
    }
  
    @Post('transport/verification')
    @UseInterceptors(FilesInterceptor('files')) // Assuming you want to handle up to 10 files
    async verifyTransport(
      @UploadedFiles() files: any,
      @Body('name') name: string,
      @Body('transportId') transportId: number,
      @Body('bankCardNumber') bankCardNumber: string,
      @Body('bankNameOfCardNumber') bankNameOfCardNumber: string,
      @Body('adrPhotoPath') adrPhotoPath: string,
      @Body('stateNumber') stateNumber: string,
      @Body('transportRegistrationState') transportRegistrationState: string,
    ) {
      console.log('3001')
      return this.transportsService.verifyTransport(files, { name, transportId, bankCardNumber, stateNumber, bankNameOfCardNumber, adrPhotoPath, transportRegistrationState })
    }
  
    @Get('transport')
    async getDriverTransport(@Query('id') id: number) {
      return this.transportsService.getTransportDriverById(id);
    }

    @Get('transport/verification')
    async getDriverTransportVerifications() {
      return this.transportsService.getTransportVerifications();
    }

    @Get('transport/verification/active')
    async getDriverActiveTransportVerifications() {
      return this.transportsService.getActiveTransportVerifications();
    }

    @Get('transport/verification/non-active')
    async getDriverNonActiveTransportVerifications() {
      return this.transportsService.getNonActiveTransportVerifications();
    }

    @Get('transport/verification/verified')
    async getDriverVerifiedTransportVerifications() {
      return this.transportsService.getVerifiedTransportVerifications();
    }

    @Get('transport/verification/rejected')
    async getDriverRejectedTransportVerifications() {
      return this.transportsService.getRejectedTransportVerifications();
    }

    @Get('transport/verification/deleted')
    async getDriverDeletedTransportVerifications() {
      return this.transportsService.getDeletedTransportVerifications();
    }
    
    @Patch('transport/verification/block')
    async blockTransportVerifications(@Query('id') id: number) {
      return this.transportsService.blockTransportVerification(id);
    }

    @Patch('transport/verification/activate')
    async activateTransportVerifications(@Query('id') id: number) {
      return this.transportsService.activateTransportVerification(id);
    }

    @Delete('transport/verification/delete')
    async deleteTransportVerifications(@Query('id') id: number) {
      return this.transportsService.deleteTransportVerification(id);
    }

    @Patch('transport/verification/verify')
    async verifyTransportVerifications(@Query('id') id: number) {
      return this.transportsService.verifyTransportVerification(id);
    }

    @Patch('transport/verification/reject')
    async rejectTransportVerifications(@Query('id') id: number) {
      return this.transportsService.rejectTransportVerification(id);
    }
  }