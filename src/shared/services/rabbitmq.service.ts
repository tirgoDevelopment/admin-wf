// src/rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport, MessagePattern } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'nestjs_queue',
      },
    });
  }

  async sendMessage(message: string): Promise<void> {
    await this.client.emit('message', message).toPromise();
  }

  @MessagePattern('message')
  handleMessage(message: string): void {
    console.log(`Received message: ${message}`);
    // Handle the incoming message
  }
}
