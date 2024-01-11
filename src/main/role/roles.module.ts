import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from "src/shared/modules/shared.module";
import { Permission } from "./entities/permission.entity";
import { Role } from "./entities/role.entity";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role]),
        TypeOrmModule.forFeature([Permission]),
        SharedModule
    ],
    controllers: [
        RolesController,
    ],
    providers: [
        RolesService,
    ],
    exports: [
        TypeOrmModule.forFeature([Role]),
        TypeOrmModule.forFeature([Permission]),
        RolesService
    ]
})
export class RolesModule {

}