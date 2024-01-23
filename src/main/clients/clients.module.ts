import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from "./client.entity";
import { SharedModule } from "src/shared/modules/shared.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Client]),
    ],
    controllers: [
    ],
    providers: [
    ],
    exports: [
        TypeOrmModule.forFeature([Client]),
    ]
})
export class ClientsModule {

}