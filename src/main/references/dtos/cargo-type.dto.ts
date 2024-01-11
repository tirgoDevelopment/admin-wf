import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CargoTypeDto {
    
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  description?: string;
}