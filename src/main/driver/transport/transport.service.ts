import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { s3 } from 'src/shared/configs/aws-config';
import { DriverTransportDto } from './dtos/driver-transport.dto';
import { BpmResponse, Driver, DriverTransport, ResponseStauses, TransportType, TransportVerification } from 'src/main//index';
import { TransportVerificationDto } from './dtos/driver-verification.dto';
import { BadRequestException } from 'src/shared/exceptions/bad-request.exception';
import { NoContentException } from 'src/shared/exceptions/no-content.exception';
import { InternalErrorException } from 'src/shared/exceptions/internal.exception';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';

@Injectable()
export class TransportsService {
    constructor(
        @InjectRepository(Driver) private readonly driversRepository: Repository<Driver>,
        @InjectRepository(TransportType) private readonly transportTypeRepository: Repository<TransportType>,
        @InjectRepository(DriverTransport) private readonly driverTransportRepository: Repository<DriverTransport>,
        @InjectRepository(TransportVerification) private readonly transportVerificationRepository: Repository<TransportVerification>,
    ) { }


    async addTransport(files: any[], createDriverDto: DriverTransportDto): Promise<BpmResponse> {

        const queryRunner = this.driversRepository.manager.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        const transport: DriverTransport = new DriverTransport();
        try {
            const transportType: TransportType = await this.transportTypeRepository.findOneOrFail({ where: { id: createDriverDto.transportTypeId } });
            const driver: Driver = await this.driversRepository.findOneOrFail({ where: { id: Number(createDriverDto.driverId) } });
            transport.name = createDriverDto.name;
            transport.transportType = transportType;
            transport.driver = driver;
            transport.description = createDriverDto.description;
            transport.cubicCapacity = createDriverDto.cubicCapacity;
            transport.stateNumber = createDriverDto.stateNumber;
            transport.isAdr = createDriverDto.isAdr;

            for (const file of files) {
                // Handle file upload to S3 using your existing logic
                const fileName = `${Date.now()}_${file.originalname}`;
                transport[file.originalname] = fileName;
                const s3Params = {
                    Bucket: 'tirgo-bucket',
                    Key: `transport/${fileName}`,
                    Body: file.buffer, // Assuming the buffer contains the file data
                };
                await s3.upload(s3Params).promise();
            }

            const newTransport = await queryRunner.manager.save(DriverTransport, transport);
            driver.driverTransport = newTransport;
            await queryRunner.manager.save(Driver, driver);
            // Return success response
            await queryRunner.commitTransaction();
            return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
        } catch (error: any) {

            await queryRunner.rollbackTransaction();

            console.log(error.driverError)
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new BadRequestException(ResponseStauses.DuplicateError)
            }
            if (error.name === 'EntityNotFoundError') {
                if (error.message.includes('transportTypeRepository')) {
                    // Handle the case where the transport type is not found in transportTypeRepository
                    console.error('Transport type not found in transportTypeRepository:', error.message);
                    throw new BadRequestException(ResponseStauses.TransportTypeNotfound);
                } else if (error.message.includes('driversRepository')) {
                    // Handle the case where the driver is not found in driversRepository
                    console.error('Driver not found in driversRepository:', error.message);
                    throw new BadRequestException(ResponseStauses.DriverNotFound);
                }
            }

            // If an error occurs, delete the uploaded files from S3
            try {
                await s3.deleteObject({ Bucket: 'tirgo-bucket', Key: `transport/${transport.techPassportFrontPhotoPath}` }).promise();
                console.log(`File ${transport.techPassportFrontPhotoPath} deleted from S3`);
                await s3.deleteObject({ Bucket: 'tirgo-bucket', Key: `transport/${transport.techPassportBackPhotoPath}` }).promise();
                console.log(`File ${transport.techPassportBackPhotoPath} deleted from S3`);
                await s3.deleteObject({ Bucket: 'tirgo-bucket', Key: `transport/${transport.transportPhotoPath}` }).promise();
                console.log(`File ${transport.transportPhotoPath} deleted from S3`);
            } catch (deleteError) {
                console.error(`Error deleting file from S3:`, deleteError);
            }

            // Return error response
            return new BpmResponse(false, null, [ResponseStauses.InternalServerError]);
        } finally {
            await queryRunner.release();
        }
    }

    async getTransportDriverById(id: number): Promise<BpmResponse> {
        if (!id) {
            throw new BadRequestException(ResponseStauses.IdIsRequired);
        }
        try {
            const driverTransport: DriverTransport | undefined = await this.driverTransportRepository.findOneOrFail({
                where: { driver: { id: id, deleted: false } },
                relations: ['driver', 'transportType'], // Include any relations you want to fetch
            });
            return new BpmResponse(true, driverTransport, null);
        } catch (err: any) {
            if (err.name === 'EntityNotFoundError') {
                throw new NoContentException();
            }
            throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
        }
    }

    async verifyTransport(files: any[], verifyTransportDto: TransportVerificationDto): Promise<BpmResponse> {

        const queryRunner = this.driverTransportRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        const verification: TransportVerification = new TransportVerification();
        const addedFiles: string[] = [];
        try {
            await queryRunner.startTransaction();
            const driverTransport: DriverTransport = await this.driverTransportRepository.findOneOrFail({ where: { id: Number(verifyTransportDto.transportId) } });

            verification.driverTransport = driverTransport;
            verification.name = verifyTransportDto.name
            verification.bankCardNumber = verifyTransportDto.bankCardNumber
            verification.stateNumber = verifyTransportDto.stateNumber
            verification.bankNameOfCardNumber = verifyTransportDto.bankNameOfCardNumber
            verification.adrPhotoPath = verifyTransportDto.adrPhotoPath
            verification.transportRegistrationState = verifyTransportDto.transportRegistrationState

            for (const file of files) {
                // Handle file upload to S3 using your existing logic
                const fileName = `${Date.now()}_${file.originalname}`;
                addedFiles.push(fileName)
                verification[file.originalname] = fileName;
                const s3Params = {
                    Bucket: 'tirgo-bucket',
                    Key: `transport/${fileName}`,
                    Body: file.buffer, // Assuming the buffer contains the file data
                };
                await s3.upload(s3Params).promise();
            }

            const newTransportVerification = await queryRunner.manager.save(TransportVerification, verification);
            driverTransport.transportVerification = newTransportVerification;
            await queryRunner.manager.save(DriverTransport, driverTransport);
            // Return success response
            await queryRunner.commitTransaction();
            return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
        } catch (error: any) {
            console.log(error)
            await queryRunner.rollbackTransaction();

            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new BadRequestException(ResponseStauses.DuplicateError);
            }
            if (error.name === 'EntityNotFoundError') {
                if (error.message.includes('transportTypeRepository')) {
                    // Handle the case where the transport type is not found in transportTypeRepository
                    console.error('Transport type not found in transportTypeRepository:', error.message);
                    throw new NotFoundException(ResponseStauses.TransportTypeNotfound);
                } else if (error.message.includes('driversRepository')) {
                    // Handle the case where the driver is not found in driversRepository
                    console.error('Driver not found in driversRepository:', error.message);
                    throw new NotFoundException(ResponseStauses.DriverNotFound);
                }
            }

            // If an error occurs, delete the uploaded files from S3
            try {
                for (let file of addedFiles) {
                    await s3.deleteObject({ Bucket: 'tirgo-bucket', Key: `transport/${file}` }).promise();
                    console.log(`File ${file} deleted from S3`);
                }
            } catch (deleteError) {
                console.error(`Error deleting file from S3:`, deleteError);
            }

            // Return error response
            throw new InternalErrorException(ResponseStauses.InternalServerError, error.message)
        } finally {
            await queryRunner.release();
        }
    }

    async getTransportVerifications(): Promise<BpmResponse> {
        try {
            const transportVerifications: TransportVerification[] | undefined = await this.transportVerificationRepository.find({
                where: { deleted: false },
                relations: ['driverTransport'], // Include any relations you want to fetch
            });
            if (!transportVerifications.length) {
                throw new NoContentException();
            }
            return new BpmResponse(true, transportVerifications, null);
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err;
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }
    }

    async getActiveTransportVerifications(): Promise<BpmResponse> {
        try {
            const transportVerifications: TransportVerification[] | undefined = await this.transportVerificationRepository.find({
                where: { deleted: false, active: true },
                relations: ['driverTransport'], // Include any relations you want to fetch
            });
            if (!transportVerifications.length) {
                throw new NoContentException();
            }
            return new BpmResponse(true, transportVerifications, null);
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err;
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }
    }

    async getNonActiveTransportVerifications(): Promise<BpmResponse> {
        try {
            const transportVerifications: TransportVerification[] | undefined = await this.transportVerificationRepository.find({
                where: { deleted: false, active: false },
                relations: ['driverTransport'], // Include any relations you want to fetch
            });
            if (!transportVerifications.length) {
                throw new NoContentException();
            }
            return new BpmResponse(true, transportVerifications, null);
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err;
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }
    }

    async getVerifiedTransportVerifications(): Promise<BpmResponse> {
        try {
            const transportVerifications: TransportVerification[] | undefined = await this.transportVerificationRepository.find({
                where: { deleted: false, verified: true },
                relations: ['driverTransport'], // Include any relations you want to fetch
            });
            if (!transportVerifications.length) {
                throw new NoContentException();
            }
            return new BpmResponse(true, transportVerifications, null);
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err;
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }
    }

    async getRejectedTransportVerifications(): Promise<BpmResponse> {
        try {
            const transportVerifications: TransportVerification[] | undefined = await this.transportVerificationRepository.find({
                where: { deleted: false, rejected: true },
                relations: ['driverTransport'], // Include any relations you want to fetch
            });
            if (!transportVerifications.length) {
                throw new NoContentException();
            }
            return new BpmResponse(true, transportVerifications, null);
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err;
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }
    }

    async getDeletedTransportVerifications(): Promise<BpmResponse> {
        try {
            const transportVerifications: TransportVerification[] | undefined = await this.transportVerificationRepository.find({
                where: { deleted: true },
                relations: ['driverTransport'], // Include any relations you want to fetch
            });
            if (!transportVerifications.length) {
                throw new NoContentException();
            }
            return new BpmResponse(true, transportVerifications, null);
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err;
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }
    }

    async blockTransportVerification(id: number): Promise<BpmResponse> {
        if (!id || isNaN(id)) {
            throw new BadRequestException(ResponseStauses.IdIsRequired);
        }
        try {
            const res = await this.transportVerificationRepository.update({ id }, { active: false })
            if (res.raw.affectedRows > 0) {
                return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
            } else {
                throw new InternalErrorException(ResponseStauses.NotModified)
            }
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }

    }

    async activateTransportVerification(id: number): Promise<BpmResponse> {
        if (!id || isNaN(id)) {
            throw new BadRequestException(ResponseStauses.IdIsRequired);
        }
        try {
            const res = await this.transportVerificationRepository.update({ id }, { active: true })
            if (res.raw.affectedRows > 0) {
                return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
            } else {
                throw new InternalErrorException(ResponseStauses.NotModified)
            }
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }

    }

    async deleteTransportVerification(id: number): Promise<BpmResponse> {
        if (!id || isNaN(id)) {
            throw new BadRequestException(ResponseStauses.IdIsRequired);
        }
        try {
            const res = await this.transportVerificationRepository.update({ id }, { deleted: true })
            if (res.raw.affectedRows > 0) {
                return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
            } else {
                throw new InternalErrorException(ResponseStauses.NotModified)
            }
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }

    }

    async verifyTransportVerification(id: number): Promise<BpmResponse> {
        if (!id || isNaN(id)) {
            throw new BadRequestException(ResponseStauses.IdIsRequired);
        }
        try {
            const res = await this.transportVerificationRepository.update({ id }, { verified: true })
            if (res.raw.affectedRows > 0) {
                return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
            } else {
                throw new InternalErrorException(ResponseStauses.NotModified)
            }
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }

    }

    async rejectTransportVerification(id: number): Promise<BpmResponse> {
        if (!id || isNaN(id)) {
            throw new BadRequestException(ResponseStauses.IdIsRequired);
        }
        try {
            const res = await this.transportVerificationRepository.update({ id }, { rejected: true })
            if (res.raw.affectedRows > 0) {
                return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
            } else {
                throw new InternalErrorException(ResponseStauses.NotModified)
            }
        } catch (err: any) {
            if (err instanceof HttpException) {
                throw err
            } else {
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
            }
        }

    }
}