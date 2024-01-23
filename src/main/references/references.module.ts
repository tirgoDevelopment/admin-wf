import { Module } from "@nestjs/common";
import { TransportType } from "./entities/transport-type.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransportTypesService } from "./services/transport-type.service";
import { TransportTypesController } from "./controllers/transport-types.controller";
import { CargoType } from "./entities/cargo-type.entity";
import { CargoTypeGroup } from "./entities/cargo-type-group.entity";
import { CargoTypesController } from "./controllers/cargo-type.controller";
import { CargoTypeGroupsController } from "./controllers/cargo-type-groups.controller";
import { CargoTypesService } from "./services/cargo-type.service";
import { CargoTypeGroupsService } from "./services/cargo-type-group.service";
import { Currency } from "./entities/currency.entity";
import { CurrenciesController } from "./controllers/currencies.controller";
import { CurrenciesService } from "./services/currency.service";
import { Subscription } from "./entities/subscription.entity";
import { SubscriptionsController } from "./controllers/subscriptions.controller";
import { SubscriptionsService } from "./services/subscription.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportType, CargoType, CargoTypeGroup, Currency, Subscription]),
  ],
  controllers: [
    TransportTypesController,
    CargoTypesController,
    CargoTypeGroupsController,
    CurrenciesController,
    SubscriptionsController
  ],
  providers: [
    TransportTypesService,
    CargoTypesService,
    CargoTypeGroupsService,
    CurrenciesService,
    SubscriptionsService
  ],
  exports: [
    TypeOrmModule.forFeature([TransportType, CargoType, CargoTypeGroup, Currency, Subscription]),
    TransportTypesService,
    CargoTypesService,
    CargoTypeGroupsService,
    CurrenciesService,
    SubscriptionsService
  ]
})
export class ReferencesModule {

}