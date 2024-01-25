import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffsController } from "./staff.controller";
import { StaffsService } from "./staffs.service";
import { SharedModule } from "src/shared/modules/shared.module";
import { RolesModule } from "../role/roles.module";
import { UsersModule } from "../users/users.module";
import { Staff } from "..";

@Module({
    imports: [
        TypeOrmModule.forFeature([Staff]),
        SharedModule,
        RolesModule,
        UsersModule
    ],
    controllers: [
        StaffsController,
    ],
    providers: [
        StaffsService,
    ],
    exports: [
        TypeOrmModule.forFeature([Staff]),
        StaffsService
    ]
})
export class StaffsModule {

}