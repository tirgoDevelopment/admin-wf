import { IsNotEmpty, IsString } from "class-validator";

export class ClientDto {

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
  email?: string;
  id?: number;

}

export class QueryDto {

  @IsNotEmpty()
  id: number;
}