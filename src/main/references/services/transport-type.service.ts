import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse, ResponseStauses } from 'src/main/index';
import { TransportType } from '../entities/transport-type.entity';
import { TransportTypeDto } from '../dtos/transport-type.dto';
import { InternalErrorException } from 'src/shared/exceptions/internal.exception';
import { BadRequestException } from 'src/shared/exceptions/bad-request.exception';
import { NoContentException } from 'src/shared/exceptions/no-content.exception';

@Injectable()
export class TransportTypesService {
    constructor(
        @InjectRepository(TransportType) private readonly transportTypesRepository: Repository<TransportType>,
    ) { }

    async createTransportType(createTransportTypeDto: TransportTypeDto): Promise<BpmResponse> {

        try {
            const transportType: TransportType = new TransportType();
            transportType.name = createTransportTypeDto.name;
            transportType.volume = createTransportTypeDto.volume;
            transportType.capacity = createTransportTypeDto.capacity;
            transportType.loadSide = createTransportTypeDto.loadSide;
            transportType.description = createTransportTypeDto.description;

            const saveResult = await this.transportTypesRepository.save(transportType);
            return new BpmResponse(true, null, [ResponseStauses.SuccessfullyCreated]);
        } catch (err: any) {
            throw new InternalErrorException(ResponseStauses.CreateDataFailed, err.message);
        }
    }

    async updateTransportType(updateTransportTypeDto: TransportTypeDto): Promise<BpmResponse> {

        try {
            const transportType: TransportType = await this.transportTypesRepository.findOneOrFail({ where: { id: updateTransportTypeDto.id } })
            transportType.name = updateTransportTypeDto.name;
            transportType.description = updateTransportTypeDto.description;
            transportType.volume = updateTransportTypeDto.volume;
            transportType.capacity = updateTransportTypeDto.capacity;
            transportType.loadSide = updateTransportTypeDto.loadSide;

            await this.transportTypesRepository.update({ id: transportType.id }, transportType);

            return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
        } catch (err: any) {
            throw new InternalErrorException(ResponseStauses.UpdateDataFailed, err.message);
        }
    }

    async getTransportTypeById(id: string): Promise<BpmResponse> {
        try {
            if (!id) {
                throw new BadRequestException(ResponseStauses.IdIsRequired);
            }
            const transportType = await this.transportTypesRepository.findOneOrFail({ where: { id, deleted: false } });
            return new BpmResponse(true, transportType, null);
        } catch (err: any) {
            if (err.name == 'EntityNotFoundError') {
                // Client not found
                throw new NoContentException();
            } else {
                // Other error (handle accordingly)
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
            }
        }
    }

    async getAllTransportTypes(): Promise<BpmResponse> {
        try {
            const transportTypes = await this.transportTypesRepository.find({ where: { deleted: false }, relations: ['createdBy'] });
            if (!transportTypes.length) {
                throw new NoContentException();
            }
            return new BpmResponse(true, transportTypes, null);
        } catch (err: any) {
            return new BpmResponse(false, null, [ResponseStauses.NotFound]);
        }
    }

    async deleteTransportType(id: string): Promise<BpmResponse> {
        try {
            if (!id) {
                return new BpmResponse(false, null, ['Id is required']);
            }
            const transportType = await this.transportTypesRepository.findOneOrFail({ where: { id, deleted: false } });
            await this.transportTypesRepository.softDelete(id);
            return new BpmResponse(true, null, [ResponseStauses.SuccessfullyDeleted]);
        } catch (err: any) {
            if (err.name == 'EntityNotFoundError') {
                // Client not found
                throw new NoContentException();
            } else {
                // Other error (handle accordingly)
                throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
            }
        }
    }

}