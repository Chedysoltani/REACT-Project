import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  duration: string;
}
