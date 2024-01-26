import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";
import { SharedModule } from "src/shared/modules/shared.module";
import { UsersModule } from "../users/users.module";
import { Client, User } from "..";

@Module({
    imports: [
        TypeOrmModule.forFeature([Client, User]),
        SharedModule,
        UsersModule
    ],
    controllers: [
        ClientsController,
    ],
    providers: [
        ClientsService,
    ],
    exports: [
        TypeOrmModule.forFeature([Client, User]),
        ClientsService
    ]
})
export class ClientsModule {

}