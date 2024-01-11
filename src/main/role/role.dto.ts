import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches, MaxLength, MinLength, UUIDVersion } from "class-validator";

export class RoleDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  description: string;

  @IsNotEmpty()
  permission: iPermission;
  id?: string;

}

interface iPermission {
  addDriver: boolean;
  addClient: boolean;
  addOrder: boolean;
  cancelOrder: boolean;
  seeDriversInfo: boolean;
  seeClientsInfo: boolean;
  sendPush: boolean;
  chat: boolean;
  tracking: boolean;
  driverFinance: boolean;
  merchantFinance: boolean;
  registrMerchant: boolean;
  verifyDriver: boolean;
  merchantList: boolean;
}