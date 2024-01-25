import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from "src/shared/modules/shared.module";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { Permission, Role } from "..";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, Permission]),
        SharedModule
    ],
    controllers: [
        RolesController,
    ],
    providers: [
        RolesService,
    ],
    exports: [
        TypeOrmModule.forFeature([Role, Permission]),
        RolesService
    ]
})
export class RolesModule {

}