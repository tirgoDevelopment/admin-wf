import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Query,
} from '@nestjs/common';
import { OrderDto } from './order.dto';
import { OrdersService } from './orders.service';

@Controller('api/v2/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(@Body() createOrderDto: OrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateOrder(@Body() updateOrderDto: OrderDto) {
    return this.ordersService.updateOrder(updateOrderDto);
  }

  @Get()
  async getOrder(@Query('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Get('all')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get('permission')
  async getAllPermission() {
    return this.ordersService.getAllPermissions();
  }
}