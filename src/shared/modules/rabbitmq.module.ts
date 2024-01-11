// src/rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from '../services/rabbitmq.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'nestjs_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [
    ClientsModule,
    RabbitMQService
],
})
export class RabbitMQModule {}
