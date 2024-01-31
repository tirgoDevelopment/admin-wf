import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityNotFoundError, Like, Repository } from 'typeorm';
import { BpmResponse, Client, ResponseStauses, User } from '..';
import { ClientDto } from './client.dto';
import { AwsService } from 'src/shared/services/aws.service';
import { InternalErrorException, NotFoundException, NoContentException, BadRequestException } from '..';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private awsService: AwsService
  ) { }

  async createClient(files: any[], createClientDto: ClientDto): Promise<Client | null> {
    const client: Client = new Client();
    let fileName;
    const queryRunner = this.clientsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      client.firstName = createClientDto.firstName;
      client.lastName = createClientDto.lastName;
      client.phoneNumber = createClientDto.phoneNumber;
      client.email = createClientDto.email;
      client.citizenship = createClientDto.citizenship
      fileName = await this.awsService.uploadClientFile(files)
      if (fileName) {
        client.passportFilePath = fileName
      } else {
        await queryRunner.rollbackTransaction();
        throw new InternalErrorException(ResponseStauses.AwsStoreFileFailed);
      }
      // Save the client entity to the database
      console.log('Before creation, ID:', client.id);
      const newClient = await this.clientsRepository.save(client);
      console.log('After creation, ID:', newClient.id);

      const user = await this.usersRepository.save({ userType: 'client', client: newClient });
      if (!user) {
        await queryRunner.rollbackTransaction();
        throw new InternalErrorException(ResponseStauses.CreateDataFailed, 'Create user failed');
      }

      newClient.user = user;
      const resClient = await this.clientsRepository.update({ id: client.id }, newClient);
      if (!resClient.affected) {
        await queryRunner.rollbackTransaction();
        throw new InternalErrorException(ResponseStauses.CreateDataFailed, 'Attach uesr to client failed');
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      return newClient;
    } catch (err: any) {
      const res = await this.awsService.deleteFile('client', fileName)
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async updateClient(updateClientDto: ClientDto): Promise<BpmResponse> {
    try {
      const client = await this.clientsRepository.findOneOrFail({ where: { id: updateClientDto.id } });
      client.firstName = updateClientDto.firstName || client.firstName;
      client.lastName = updateClientDto.lastName || client.lastName;
      client.phoneNumber = updateClientDto.phoneNumber || client.phoneNumber;
      client.additionalPhoneNumber = updateClientDto.additionalPhoneNumber || client.additionalPhoneNumber;
      client.email = updateClientDto.email || client.email;
      client.citizenship = updateClientDto.citizenship || client.citizenship;

      const res = await this.clientsRepository.update({ id: client.id }, client);
      if (res.affected) {
        return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
      } else {
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async updateClientWhileLogin(updateClientDto: ClientDto): Promise<boolean> {
    try {
      await this.clientsRepository.update({ id: updateClientDto.id }, updateClientDto);
      return true
    } catch (err: any) {
      return false
    }
  }

  async getClientById(id: number): Promise<BpmResponse> {
    if (!id) {
      return new BpmResponse(false, null, ['Id id required']);
    }
    try {
      const client = await this.clientsRepository.findOneOrFail({ where: { id, deleted: false } });
      if (!client) {
        throw new NotFoundException(ResponseStauses.UserNotFound);
      }
      return new BpmResponse(true, client, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async findByPhoneNumber(phoneNumber: string) {
    try {
      const client = await this.clientsRepository.findOneOrFail({ where: { phoneNumber, deleted: false } });
      return client
    } catch (err: any) {
      return null;
    }
  }

  async findById(id: number) {
    try {
      const client = await this.clientsRepository.findOneOrFail({ where: { id, deleted: false } });
      return client
    } catch (err: any) {
      return null;
    }
  }

  async getAllClients(id: number, firstname: string, phoneNumber: string, createdAtFrom: string, createdAtTo: string, lastLoginFrom: string, lastLoginTo: string): Promise<BpmResponse> {
    try {
      let filterCriteria: Record<string, any> = { deleted: false };
      if (id) {
        filterCriteria.id = id;
      }
      if (firstname) {
        filterCriteria.firstname = Like(`%${firstname}%`);
      }
      if (phoneNumber) {
        filterCriteria.phoneNumber = Like(`%${phoneNumber}%`);
      }
      if (createdAtFrom && createdAtTo) {
        filterCriteria.createdAt = Between(new Date(createdAtFrom), new Date(createdAtTo));
      }
      if (lastLoginFrom && lastLoginTo) {
        filterCriteria.lastLogin = Between(new Date(lastLoginFrom), new Date(lastLoginTo));
      }
      const clients = await this.clientsRepository.find({ where: filterCriteria });
      if (!clients.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, clients, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async getAllActiveClients(): Promise<BpmResponse> {
    try {
      const clients = await this.clientsRepository.find({ where: { active: true, deleted: false } });
      if (!clients.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, clients, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async getAllNonActiveClients(): Promise<BpmResponse> {
    try {
      const clients = await this.clientsRepository.find({ where: { active: false, deleted: false } });
      if (!clients.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, clients, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async getAllDeletedClients(): Promise<BpmResponse> {
    try {
      const clients = await this.clientsRepository.find({ where: { deleted: true } });
      if (!clients.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, clients, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async deleteClient(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      const client = await this.clientsRepository.findOneOrFail({ where: { id } });

      if (client.deleted) {
        // Client is already deleted
        throw new BadRequestException(ResponseStauses.AlreadyDeleted);
      }

      const updateResult = await this.clientsRepository.update({ id: client.id }, { deleted: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        // Client not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
       throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async blockClient(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      const client = await this.clientsRepository.findOneOrFail({ where: { id } });

      if (!client.active) {
        // Client is already blocked
        throw new BadRequestException(ResponseStauses.AlreadyBlocked);
      }

      const updateResult = await this.clientsRepository.update({ id: client.id }, { active: false });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        // Client not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
       throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async activateClient(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      const client = await this.clientsRepository.findOneOrFail({ where: { id } });

      if (client.active) {
        // Client is already blocked
        throw new BadRequestException(ResponseStauses.AlreadyActive);
      }

      const updateResult = await this.clientsRepository.update({ id: client.id }, { active: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        // Client not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
       throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

}