import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  duration?: string;
}
