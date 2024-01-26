import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversController } from "./users/drivers.controller";
import { DriversService } from "./users/drivers.service";
import { SharedModule } from "src/shared/modules/shared.module";
import { TransportsController } from "./transport/transport.controller";
import { TransportsService } from "./transport/transport.service";
import { UsersModule } from "../users/users.module";
import { Driver, DriverTransport, TransportType, TransportVerification } from "..";

@Module({
    imports: [
        TypeOrmModule.forFeature([Driver, DriverTransport, TransportVerification, TransportType]),
        SharedModule,
        UsersModule
    ],
    controllers: [
        DriversController,
        TransportsController
    ],
    providers: [
        DriversService,
        TransportsService
    ],
    exports: [
        TypeOrmModule.forFeature([Driver, DriverTransport, TransportVerification, TransportType]),
        DriversService,
    ]
})
export class DriversModule {

}