import { uuid } from "aws-sdk/clients/customerprofiles";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class DriverTransportDto {

  
  @IsUUID()
  @IsNotEmpty()
  name: string;
  transportTypeId?: uuid;
  description?: string;
  cubicCapacity?: string;
  stateNumber?: string
  isAdr?: boolean;
  techPassportFrontPhotoPathName?: string;
  techPassportBackPhotoPathName?: string;
  transportPhotoPathName?: string;
  goodsTransportationLicenseCardPhotoPathName?: string;

  id?: number;
  driverId?: number;

}
