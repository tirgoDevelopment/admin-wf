import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransportTypesService } from "./services/transport-type.service";
import { TransportTypesController } from "./controllers/transport-types.controller";
import { CargoTypesController } from "./controllers/cargo-type.controller";
import { CargoTypeGroupsController } from "./controllers/cargo-type-groups.controller";
import { CargoTypesService } from "./services/cargo-type.service";
import { CargoTypeGroupsService } from "./services/cargo-type-group.service";
import { CurrenciesController } from "./controllers/currencies.controller";
import { CurrenciesService } from "./services/currency.service";
import { SubscriptionsController } from "./controllers/subscriptions.controller";
import { SubscriptionsService } from "./services/subscription.service";
import { CargoType, CargoTypeGroup, Currency, Subscription, TransportType, TransportKind, CargoStatus, User, SubscriptionPayment } from "..";
import { TransportKindsController } from "./controllers/transport-kinds.controller";
import { TransportKindsService } from "./services/transport-kind.service";
import { CargoStatusesController } from "./controllers/cargo-status.controller";
import { CargoStatusesService } from "./services/cargo-status.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportType, CargoType, CargoTypeGroup, Currency, Subscription, SubscriptionPayment, TransportKind, CargoStatus, User]),
  ],
  controllers: [
    TransportTypesController,
    CargoTypesController,
    CargoTypeGroupsController,
    CurrenciesController,
    SubscriptionsController,
    TransportKindsController,
    CargoStatusesController
  ],
  providers: [
    TransportTypesService,
    CargoTypesService,
    CargoTypeGroupsService,
    CurrenciesService,
    SubscriptionsService,
    TransportKindsService,
    CargoStatusesService
  ],
  exports: [
    TypeOrmModule.forFeature([TransportType, CargoType, CargoTypeGroup, Currency, Subscription, SubscriptionPayment, TransportKind, CargoStatus, User]),
    TransportTypesService,
    CargoTypesService,
    CargoTypeGroupsService,
    CurrenciesService,
    SubscriptionsService,
    TransportKindsService
  ]
})
export class ReferencesModule {

}