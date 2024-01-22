import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UsePipes,
  ValidationPipe,
  Put,
  Query,
} from '@nestjs/common';
import { SubscriptionDto } from './sbscription.dto';
import { SubscriptionsService } from './subscription.service';

@Controller('api/v2/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }


  @Put()
  @UsePipes(ValidationPipe)
  async updateSubscription(@Body() updateSubscriptionDto: SubscriptionDto) {
    return this.subscriptionsService.updateSubscription(updateSubscriptionDto);
  }

  @Get()
  async getSubscription(@Query('id') id: number) {
    return this.subscriptionsService.getSubscriptionById(id);
  }

  @Get('all')
  async getAllSubscription() {
    return this.subscriptionsService.getAllSubscriptions();
  }

  @Get('active')
  async getAllActiveSubscription() {
    return this.subscriptionsService.getAllActiveSubscriptions();
  }

  @Get('non-active')
  async getAllNonActiveSubscription() {
    return this.subscriptionsService.getAllNonActiveSubscriptions();
  }

  @Get('deleted')
  async getAllDeletedSubscription() {
    return this.subscriptionsService.getAllDeletedSubscriptions();
  }

  @Patch('delete')
  async deleteSubscription(@Query('id') id: number) {
    return this.subscriptionsService.deleteSubscription(id);
  }

  @Patch('block')
  async blockSubscription(@Query('id') id: number) {
    return this.subscriptionsService.blockSubscription(id);
  }

  @Patch('activate')
  async activateSubscription(@Query('id') id: number) {
    return this.subscriptionsService.activateSubscription(id);
  }
}