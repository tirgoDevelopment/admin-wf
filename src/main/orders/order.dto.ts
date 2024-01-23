import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class OrderDto {

  id?: string;
  
  @IsNumber()
  @IsNotEmpty()
  clientId

  @IsNumber()
  @IsNotEmpty()
  driverId

  @IsDate()
  @IsNotEmpty()
  sendDate

  @IsDate()
  @IsNotEmpty()
  sendTime

  @IsBoolean()
  @IsNotEmpty()
  isUrgent

  @IsBoolean()
  @IsNotEmpty()
  isDangerousCargo

  @IsUUID()
  @IsNotEmpty()
  currencyId

  @IsNumber()
  @IsNotEmpty()
  offeredPrice

  @IsUUID()
  @IsNotEmpty()
  cargoTypeId

  @IsNumber()
  @IsNotEmpty()
  cargoWeight

  @IsNumber()
  @IsNotEmpty()
  cargoLength

  @IsNumber()
  @IsNotEmpty()
  cargiWidth

  @IsNumber()
  @IsNotEmpty()
  cargoHeight

  @IsUUID()
  @IsNotEmpty()
  transportTypeId

  @IsUUID()
  @IsNotEmpty()
  cargoStatusId

  @IsBoolean()
  @IsNotEmpty()
  isSafeTransaction

  @IsString()
  @IsNotEmpty()
  sendLocation

  @IsString()
  @IsNotEmpty()
  deliveryLocation

}