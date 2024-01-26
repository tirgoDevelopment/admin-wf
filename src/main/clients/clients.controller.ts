import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Patch,
  UsePipes,
  ValidationPipe,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { ClientDto } from './client.dto';
import { ClientsService } from './clients.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/v2/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post('')
  @UseInterceptors(FilesInterceptor('file')) // Assuming you want to handle up to 10 files
  async createClient(
    @UploadedFiles() file: any,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('email') email: string,
    @Body('citizenship') citizenship: string,
  ) {
    console.log(firstName)

   return this.clientsService.createClient(file, { firstName, lastName, phoneNumber, email, citizenship } )
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateClient(@Body() updateClientDto: ClientDto) {
    return this.clientsService.updateClient(updateClientDto);
  }

  @Get('id')
  async getClient(@Query('id') id: number) {
    return this.clientsService.getClientById(id);
  }

  @Get('all')
  async getAllClient() {
    return this.clientsService.getAllClients();
  }

  @Get('active')
  async getAllActiveClient() {
    return this.clientsService.getAllActiveClients();
  }

  @Get('non-active')
  async getAllNonActiveClient() {
    return this.clientsService.getAllNonActiveClients();
  }

  @Get('deleted')
  async getAllDeletedClient() {
    return this.clientsService.getAllDeletedClients();
  }

  @Delete()
  async deleteClient(@Query('id') id: number) {
    return this.clientsService.deleteClient(id);
  }

  @Patch('block')
  async blockClient(@Query('id') id: number) {
    return this.clientsService.blockClient(id);
  }

  @Patch('activate')
  async activateClient(@Query('id') id: number) {
    return this.clientsService.activateClient(id);
  }
}