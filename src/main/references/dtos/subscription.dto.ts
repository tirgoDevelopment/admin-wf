import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID, Matches, MaxLength, MinLength, UUIDVersion } from "class-validator";

export class SubscriptionDto {

  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}

export class SubscriptionPaymentDto {

  id?: number;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  price: number;
}