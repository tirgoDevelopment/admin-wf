import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SundryService } from 'src/shared/services/sundry.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { BpmResponse, ResponseStauses, Role, User } from '..';
import { SubscriptionDto } from './sbscription.dto';
import { Subscription } from './subscription.entity';
import { InternalErrorException } from 'src/shared/exceptions/internal.exception';
import { NoContentException } from 'src/shared/exceptions/no-content.exception';
import { BadRequestException } from 'src/shared/exceptions/bad-request.exception';
import { NotFoundException } from '../../shared/exceptions/not-found.exception';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) { }

  async createSubscription(createSubscriptionDto: SubscriptionDto): Promise<BpmResponse> {
    try {
      const subscription: Subscription = new Subscription();
      subscription.name = createSubscriptionDto.name;
      subscription.duration = createSubscriptionDto.duration;
      subscription.price = createSubscriptionDto.price;

      const newSubscription = await this.subscriptionRepository.save(subscription);

      const resClient = await this.subscriptionRepository.update({ id: subscription.id }, newSubscription);
      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyCreated]);
    } catch (err: any) {
      if (err.name === "EntityNotFoundError") {
        // Subscription not found
       throw new NoContentException();
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }

  async updateSubscription(updateSubscriptionDto: SubscriptionDto): Promise<BpmResponse> {
    try {
      const subscription = await this.subscriptionRepository.findOneOrFail({ where: { id: updateSubscriptionDto.id } });
      subscription.name = updateSubscriptionDto.name;
      subscription.duration = updateSubscriptionDto.duration;
      subscription.price = updateSubscriptionDto.price;
      await this.subscriptionRepository.update({ id: subscription.id }, subscription);
      return new BpmResponse(true, null, [ResponseStauses.SuccessfullyUpdated]);
    } catch (err: any) {
      if (err.name === "EntityNotFoundError") {
          throw new NotFoundException(ResponseStauses.NotFound);
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }

  async getSubscriptionById(id: number): Promise<BpmResponse> {
    if(!id) {
      throw new BadRequestException(ResponseStauses.IdIsRequired);
    }
    try {
      const subscription = await this.subscriptionRepository.findOneOrFail({ where: { id, deleted: false } });
      return new BpmResponse(true, subscription, null);
    } catch (err: any) {
      if(err.name == 'EntityNotFoundError') {
        throw new NoContentException();
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async getAllSubscriptions(): Promise<BpmResponse> {
    try {
      const subscriptions = await this.subscriptionRepository.find({ where: { deleted: false } });
      if (!subscriptions.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, subscriptions, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async getAllActiveSubscriptions(): Promise<BpmResponse> {
    try {
      const subscriptions = await this.subscriptionRepository.find({ where: { active: true, deleted: false } });
      if (!subscriptions.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, subscriptions, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async getAllNonActiveSubscriptions(): Promise<BpmResponse> {
    try {
      const subscriptions = await this.subscriptionRepository.find({ where: { active: false, deleted: false } });
      if (!subscriptions.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, subscriptions, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async getAllDeletedSubscriptions(): Promise<BpmResponse> {
    try {
      const subscriptions = await this.subscriptionRepository.find({ where: { deleted: true } });
      if (!subscriptions.length) {
        throw new NoContentException();
      }
      return new BpmResponse(true, subscriptions, null);
    } catch (err: any) {
      if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async deleteSubscription(id: number): Promise<BpmResponse> {
    try {
      if(!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const subscription = await this.subscriptionRepository.findOneOrFail({ where: { id } });

      if (subscription.deleted) {
        // Subscription is already deleted 
        throw new BadRequestException(ResponseStauses.AlreadyDeleted);
      }

      const updateResult = await this.subscriptionRepository.update({ id: subscription.id }, { deleted: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Subscription not found
        throw new NoContentException();
      } else if(err instanceof HttpException) {
        throw err
      } else {
        throw new InternalErrorException(ResponseStauses.InternalServerError, err.message);
      }
    }
  }

  async blockSubscription(id: number): Promise<BpmResponse> {
    try {
      if(!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const subscription = await this.subscriptionRepository.findOneOrFail({ where: { id } });

      if (!subscription.active) {
        // Subscription is already blocked
          throw new BadRequestException(ResponseStauses.AlreadyBlocked);
      }

      const updateResult = await this.subscriptionRepository.update({ id: subscription.id }, { active: false });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Subscription not found
        throw new NoContentException()
      } else {
        // Other error (handle accordingly)
        throw new InternalErrorException(ResponseStauses.InternalServerError);
      }
    }
  }

  async activateSubscription(id: number): Promise<BpmResponse> {
    try {
      if(!id) {
        throw new BadRequestException(ResponseStauses.IdIsRequired);
      }
      const subscription = await this.subscriptionRepository.findOneOrFail({ where: { id } });

      if (subscription.active) {
        // Subscription is already blocked
        throw new BadRequestException(ResponseStauses.AlreadyActive);
      }

      const updateResult = await this.subscriptionRepository.update({ id: subscription.id }, { active: true });

      if (updateResult.affected > 0) {
        // Update was successful
        return new BpmResponse(true, null, null);
      } else {
        // Update did not affect any rows
        throw new InternalErrorException(ResponseStauses.NotModified);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        // Subscription not found
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