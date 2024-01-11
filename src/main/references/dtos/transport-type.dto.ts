import { IsNotEmpty, IsString } from "class-validator";

export class TransportTypeDto {
    
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  loadSide: string;

  @IsNotEmpty()
  volume: string;

  @IsNotEmpty()
  capacity: string;

  description?: string;

  id?: string;
}