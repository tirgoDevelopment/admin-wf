// rabbitmq.service.ts

import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(
    ) {}

  async onModuleInit() {
    await this.init();
    await this.setupQueueConsumers();
  }

  async init() {
    this.connection = await amqp.connect("amqp://localhost:5672");
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('message');
  }

  private async setupQueueConsumers() {
    // Consume messages from 'message' queue
    this.channel.consume('message', this.handleMessage.bind(this), { noAck: true });
  }

  private async handleMessage(msg: amqp.ConsumeMessage | null) {
    if (msg) {
      const messageContent = msg.content.toString();
      try {
        const data = JSON.parse(messageContent);
        console.log(`Received message message: ${JSON.stringify(data)}`);
      } catch (error) {
        console.error('Error parsing message message:', error);
      }
    }
  }

}
