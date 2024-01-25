import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class OrderDto {

  id?: string;
  
  @IsString()
  @IsNotEmpty()
  loadingLocation: string;

  @IsString()
  @IsNotEmpty()
  deliveryLocation: string;

  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  cargoStatusId?: number;

  customsPlaceLocation?: string;
  customsClearancePlaceLocation?: string;
  additionalLoadingLication?: string;
  additionalLoadingLocation?: string;
  isAdr?: boolean;
  isCarnetTir?: string;
  isGlonas?: boolean;
  isParanom?: boolean;
  offeredPrice?: number;
  paymentMethod?: string;
  inAdvancePrice?: number;
  offeredPriceCurrencyId: string;
  inAdvancePriceCurrencyId: string;

  @IsDate()
  @IsNotEmpty()
  sendDate: Date;

  @IsBoolean()
  @IsNotEmpty()
  isSafeTransaction: boolean;

  @IsUUID()
  @IsNotEmpty()
  transportTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  transportKindId: string;

  @IsUUID()
  @IsNotEmpty()
  cargoTypeId: string;

  cargoWeight?: number;
  cargoLength?: number;
  cargiWidth?: number;
  cargoHeight?: number;
  volume?: number;

  loadingMethodId?: string;
  cargoPackageId?: string;
}