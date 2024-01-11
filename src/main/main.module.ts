import { Module } from "@nestjs/common";
import { RolesModule } from "./role/roles.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "src/shared/auth/auth.module";
import { ReferencesModule } from "./references/references.module";

@Module({
  imports: [
    UsersModule,
    RolesModule,
    AuthModule,
    ReferencesModule
  ],
  controllers: [
  ],
  providers: [
  ],
  exports: [
    UsersModule,
    RolesModule,
    AuthModule,
    ReferencesModule
  ]
})
export class MainModule {

}