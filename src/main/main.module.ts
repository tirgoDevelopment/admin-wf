import { Module } from "@nestjs/common";
import { RolesModule } from "./role/roles.module";
import { StaffsModule } from "./staffs/staffs.module";
import { AuthModule } from "src/shared/auth/auth.module";
import { ReferencesModule } from "./references/references.module";
import { UsersModule } from "./users/users.module";
import { ClientsModule } from "./clients/clients.module";

@Module({
  imports: [
    StaffsModule,
    RolesModule,
    AuthModule,
    ReferencesModule,
    UsersModule,
    ClientsModule
  ],
  controllers: [
  ],
  providers: [
  ],
  exports: [
    StaffsModule,
    RolesModule,
    AuthModule,
    ReferencesModule,
    UsersModule,
    ClientsModule
  ]
})
export class MainModule {

}