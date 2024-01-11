import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SharedModule } from "src/shared/modules/shared.module";
import { RolesModule } from "../role/roles.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        SharedModule,
        RolesModule
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
    ],
    exports: [
        TypeOrmModule.forFeature([User]),
        UsersService
    ]
})
export class UsersModule {

}