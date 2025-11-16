import { IsString, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsPhoneNumber('TN') // Adaptez le code pays si nécessaire
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
