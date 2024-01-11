import { Module } from "@nestjs/common";
import { TransportType } from "./entities/transport-type.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransportTypesService } from "./services/transport-type.service";
import { TransportTypesController } from "./controllers/transport-types.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportType]),
  ],
  controllers: [
    TransportTypesController
  ],
  providers: [
    TransportTypesService
  ],
  exports: [
    TypeOrmModule.forFeature([TransportType]),
    TransportTypesService
  ]
})
export class ReferencesModule {

}