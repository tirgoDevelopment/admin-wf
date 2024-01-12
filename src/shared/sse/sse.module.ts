import { Module } from "@nestjs/common";
import { SundryService } from "../services/sundry.service";
import { Config } from "../entities/config.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SmsService } from "../services/sms.service";
import { MailService } from "../services/mail.service";
import { RabbitMQSenderService } from "../services/rabbitmq-sender.service";
import { SseController } from "./sse.controller";
import { SseGateway } from "./sse.service";

@Module({
  controllers: [
    SseController
  ],
  providers: [
    SseGateway
  ],
  exports: [
    SseGateway
  ]
})
export class SseModule {

}