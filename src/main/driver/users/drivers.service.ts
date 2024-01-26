import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { BpmResponse, Driver, ResponseStauses, User } from '../..';
import { DriverDto } from './driver.dto';
import { s3 } from 'src/shared/configs/aws-config';
import { InternalErrorException } from 'src/shared/exceptions/internal.exception';
import { NoContentException } from 'src/shared/exceptions/no-content.exception';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver) private readonly driversRepository: Repository<Driver>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }

  async createDriver(files: any[], createDriverDto: DriverDto): Promise<Driver | null> {
    const driver: Driver = new Driver();
    const queryRunner = this.driversRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      driver.firstName = createDriverDto.firstName;
      driver.lastName = createDriverDto.lastName;
      driver.phoneNumber = createDriverDto.phoneNumber;
      driver.email = createDriverDto.email;
      driver.citizenship = createDriverDto.citizenship
      const start = Date.now();
      console.log('start', start)
      for (const file of files) {
        // Handle file upload to S3 using your existing logic
        const fileName = `${Date.now()}_${file.originalname}`;
        driver[file.originalname] = fileName;
        const s3Params = {
          Bucket: 'tirgo-bucket',
          Key: `driver/${fileName}`,
          Body: file.buffer, // Assuming the buffer contains the file data
        };
        await s3.upload(s3Params).promise();
      }
      console.log('end', Date.now() - start)
      const newDriver = await this.driversRepository.save(driver);

      const user = await this.usersRepository.save({ userType: 'driver', driver: newDriver });
      if(!user) {
        await queryRunner.rollbackTransaction(); 
        throw new Error('Create user failed');
      }

      newDriver.user = user;
      const resDriver = await this.usersRepository.update({ id: driver.id }, newDriver);
      if(!resDriver.affected) {
        await queryRunner.rollbackTransaction();
        throw new Error('Attach uesr to driver failed');
      }

      return newDriver;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      // If an error occurs, delete the uploaded files from S3
      try {
        await s3.deleteObject({ Bucket: 'tirgo-bucket', Key: `driver/${driver.passportFilePath}` }).promise();
        console.log(`File ${driver.passportFilePath} deleted from S3`);
        await s3.deleteObject({ Bucket: 'tirgo-bucket', Key: `driver/${driver.driverLicenseFilePath}` }).promise();
        console.log(`File ${driver.driverLicenseFilePath} deleted from S3`);
      } catch (deleteError) {
        console.error(`Error deleting file ${driver.passportFilePath} / ${driver.driverLicenseFilePath} from S3:`, deleteError);
      }
      return null
    }
  }

  async updateDriver(updateDriverDto: DriverDto): Promise<BpmResponse> {
    try {
      const driver = await this.driversRepository.findOneOrFail({ where: { id: updateDriverDto.id } });
      driver.firstName = updateDriverDto.firstName || driver.firstName;
      driver.lastName = updateDriverDto.lastName || driver.lastName;
      driver.phoneNumber = updateDriverDto.phoneNumber || driver.phoneNumber;
      driver.additionalPhoneNumber = updateDriverDto.additionalPhoneNumber || driver.additionalPhoneNumber;
      driver.email = updateDriverDto.email || driver.email;
      driver.citizenship = updateDriverDto.citizenship || driver.citizenship;

      await this.driversRepository.update({ id: driver.id }, driver);
      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
    } catch (err: any) {
      throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
    }
  }

  async updateDriverWhileLogin(updateDriverDto: DriverDto): Promise<boolean> {
    try {
      await this.driversRepository.update({ id: updateDriverDto.id }, updateDriverDto);
      return true
    } catch (err: any) {
      return false
    }
  }

  async getDriverById(id: number): Promise<BpmResponse> {
    if (!id) {
      return new BpmResponse(false, null, ['Id id required']);
    }
    try {
      const driver: Driver | undefined = await this.driversRepository.findOneOrFail({
        where: { id },
        relations: ['driverTransport', 'driverTransport.transportType'],
      });

      return new BpmResponse(true, driver, null);
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

  async findByPhoneNumber(phoneNumber: string) {
    try {
      const driver = await this.driversRepository.findOneOrFail({ where: { phoneNumber, deleted: false } });
      return driver
    } catch (err: any) {
      return null;
    }
  }

  async findById(id: number) {
    try {
      const driver = await this.driversRepository.findOneOrFail({ where: { id, deleted: false } });
      return driver
    } catch (err: any) {
      return null;
    }
  }

  async getAllDrivers(): Promise<BpmResponse> {
    try {
      const drivers = await this.driversRepository.find({ where: { deleted: false } });
      if (!drivers.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, drivers, null);
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
       throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async getAllActiveDrivers(): Promise<BpmResponse> {
    try {
      const drivers = await this.driversRepository.find({ where: { active: true, deleted: false } });
      if (!drivers.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, drivers, null);
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
       throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async getAllNonActiveDrivers(): Promise<BpmResponse> {
    try {
      const drivers = await this.driversRepository.find({ where: { active: false, deleted: false } });
      if (!drivers.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, drivers, null);
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
       throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async getAllDeletedDrivers(): Promise<BpmResponse> {
    try {
      const drivers = await this.driversRepository.find({ where: { deleted: true } });
      if (!drivers.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, drivers, null);
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
       throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }

  async deleteDriver(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const driver = await this.driversRepository.findOneOrFail({ where: { id } });

      if (driver.deleted) {
        // Driver is already deleted
        throw new BadRequestException(ResponseStauses.AlreadyDeleted);
      }

      const updateResult = await this.driversRepository.update({ id: driver.id }, { deleted: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified)
      }
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        // Driver not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }

  async blockDriver(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const driver = await this.driversRepository.findOneOrFail({ where: { id } });

      if (!driver.active) {
        // Driver is already blocked
        throw new BadRequestException(ResponseStauses.AlreadyBlocked);
      }

      const updateResult = await this.driversRepository.update({ id: driver.id }, { active: false });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified)
      }
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        // Driver not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }

  async activateDriver(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const driver = await this.driversRepository.findOneOrFail({ where: { id } });

      if (driver.active) {
        // Driver is already blocked
        throw new BadRequestException(ResponseStauses.AlreadyActive);
      }

      const updateResult = await this.driversRepository.update({ id: driver.id }, { active: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified)
      }
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        // Driver not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }


}