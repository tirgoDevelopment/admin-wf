import { Module } from "@nestjs/common";
import { SundryService } from "../services/sundry.service";
import { RabbitMQSenderService } from "../services/rabbitmq-sender.service";
import { RabbitMQConsumerService } from "../services/rabbitmq-consumer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  TransportType,
  CargoType,
  CargoTypeGroup,
  CargoStatus,
  Currency,
  Subscription,
  Role,
  Permission,
  Staff,
  Transaction,
  User,
  Client,
  Driver,
  DriverTransport,
  TransportVerification,
  Config,
  Order
} from '../entites/index'
import { AwsService } from "../services/aws.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransportType,
      CargoType,
      CargoTypeGroup,
      CargoStatus,
      Currency,
      Subscription,
      Role,
      Permission,
      Staff,
      Transaction,
      User,
      Client,
      Driver,
      DriverTransport,
      TransportVerification,
      Config,
      Order
    ]),
  ],
  controllers: [
  ],
  providers: [
    SundryService,
    RabbitMQSenderService,
    RabbitMQConsumerService,
    AwsService
  ],
  exports: [
    SundryService,
    RabbitMQSenderService,
    RabbitMQConsumerService,
    AwsService
  ]
})
export class SharedModule {

}