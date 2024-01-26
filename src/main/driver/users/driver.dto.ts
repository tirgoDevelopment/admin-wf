import { IsNotEmpty, IsString } from "class-validator";

export class DriverDto {

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  additionalPhoneNumber?: string;
  citizenship?: string;
  pasportFilePath?: string;
  driverLicenseFilePath?: string;
  email?: string;
  id?: number;

}
