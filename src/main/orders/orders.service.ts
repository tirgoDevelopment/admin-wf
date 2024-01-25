import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse, ResponseStauses } from '..';
import { Order } from '../../shared/entites/orders/entities/order.entity';
import { OrderDto } from './order.dto';
import { InternalErrorException } from 'src/shared/exceptions/internal.exception';
import { BadRequestException } from 'src/shared/exceptions/bad-request.exception';
import { NoContentException } from 'src/shared/exceptions/no-content.exception';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    // @InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>
  ) { }

  async createOrder(createOrderDto: OrderDto): Promise<BpmResponse> {
    const queryRunner = this.ordersRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order: Order = new Order();

      // Save order
      const savedOrder = await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();

      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyCreated]);
    } catch (err: any) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new InternalErrorException(ResponseStauses.CreateDataFailed);
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrder(updateOrderDto: OrderDto): Promise<BpmResponse> {
    const queryRunner = this.ordersRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the existing order 
      const existingOrder = await queryRunner.manager.findOne(Order, { where: { id: updateOrderDto.id } });

      if (!existingOrder) {
        return new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }

      // Update order properties

      // Save updated order
      const updatedOrder = await queryRunner.manager.save(Order, existingOrder);

      // Find the associated permission

      await queryRunner.commitTransaction();

      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      return new BpmResponse(false, null, [ResponseStauses.UpdateDataFailed]);
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderById(id: string): Promise<BpmResponse> {
    try {
      if (!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const order = await this.ordersRepository.findOneOrFail({ where: { id, deleted: false } });
      return new BpmResponse(true, order, null);
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

  async getAllOrders(): Promise<BpmResponse> {
    try {
      const orders = await this.ordersRepository.find({ where: { deleted: false }, relations: ['permission'] });
      if (!orders.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, orders, null);
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        // Client not found
        throw new NoContentException();
      } else if (err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }


  async getAllPermissions(): Promise<BpmResponse> {
    try {
      return new BpmResponse(true, null, [])
    } catch (err: any) {
      if (err.name == 'EntityNotFoundError') {
        // Client not found
        throw new NoContentException();
      } else if (err instanceof HttpException) {
        throw err
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message)
      }
    }
  }
}