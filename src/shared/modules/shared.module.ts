import { Module } from "@nestjs/common";
import { SundryService } from "../services/sundry.service";

@Module({
  imports: [
  ],
  controllers: [
  ],
  providers: [
    SundryService
  ],
  exports: [
    SundryService
  ]
})
export class SharedModule {

}