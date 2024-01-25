import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from "src/shared/modules/shared.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { Order } from "..";

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        SharedModule
    ],
    controllers: [
        OrdersController,
    ],
    providers: [
        OrdersService,
    ],
    exports: [
        TypeOrmModule.forFeature([Order]),
        OrdersService
    ]
})
export class OrdersModule {

}