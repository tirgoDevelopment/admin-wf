import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from "./client.entity";

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