import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from "./subscription.entity";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscription.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription]),
    ],
    controllers: [
        SubscriptionsController,
    ],
    providers: [
        SubscriptionsService,
    ],
    exports: [
        TypeOrmModule.forFeature([Subscription]),
        SubscriptionsService
    ]
})
export class SubscriptionsModule {

}