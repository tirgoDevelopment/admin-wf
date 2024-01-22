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

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportType, CargoType, CargoTypeGroup]),
  ],
  controllers: [
    TransportTypesController,
    CargoTypesController,
    CargoTypeGroupsController
  ],
  providers: [
    TransportTypesService,
    CargoTypesService,
    CargoTypeGroupsService
  ],
  exports: [
    TypeOrmModule.forFeature([TransportType, CargoType, CargoTypeGroup]),
    TransportTypesService,
    CargoTypesService,
    CargoTypeGroupsService
  ]
})
export class ReferencesModule {

}