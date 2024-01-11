import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse, ResponseStauses } from 'src/main/index';
import { TransportType } from '../entities/transport-type.entity';
import { TransportTypeDto } from '../dtos/transport-type.dto';

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
            console.log(err)
            return new BpmResponse(false, null, [ResponseStauses.CreateDataFailed]);
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
            return new BpmResponse(false, null, [ResponseStauses.UpdateDataFailed]);
        }
    }

    async getTransportTypeById(id: string): Promise<BpmResponse> {
        try {
            if (!id) {
                return new BpmResponse(false, null, ['Id is required']);
            }
            const transportType = await this.transportTypesRepository.findOneOrFail({ where: { id, deleted: false } });
            if (!transportType) {
                return new BpmResponse(false, null, [ResponseStauses.NotFound]);
            }
            return new BpmResponse(true, transportType, null);
        } catch (err: any) {
            return new BpmResponse(false, null, [ResponseStauses.NotFound]);
        }
    }

    async getAllTransportTypes(): Promise<BpmResponse> {
        try {
            const transportTypes = await this.transportTypesRepository.find({ where: { deleted: false }, relations: ['createdBy'] });
            if (!transportTypes.length) {
                return new BpmResponse(false, null, [ResponseStauses.NotFound]);
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
            if (!transportType) {
                return new BpmResponse(false, null, [ResponseStauses.NotFound]);
            }
            await this.transportTypesRepository.softDelete(id);
            return new BpmResponse(true, null, [ResponseStauses.SuccessfullyDeleted]);
        } catch (err: any) {
            return new BpmResponse(false, null, [ResponseStauses.SuccessfullyDeleted]);
        }
    }

}