import { Module } from "@nestjs/common";
import { SundryService } from "../services/sundry.service";
import { RabbitMQSenderService } from "../services/rabbitmq-sender.service";
import { RabbitMQConsumerService } from "../services/rabbitmq-consumer.service";

@Module({
  imports: [
  ],
  controllers: [
  ],
  providers: [
    SundryService,
    RabbitMQSenderService,
    RabbitMQConsumerService
  ],
  exports: [
    SundryService,
    RabbitMQSenderService,
    RabbitMQConsumerService
  ]
})
export class SharedModule {

}