import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateDoctorDto {
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Le nom de famille est requis' })
  @IsString()
  lastName: string;

  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @IsNotEmpty({ message: 'La spécialité est requise' })
  @IsString()
  specialty: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  photo?: string;

  @IsOptional()
  workingHours?: Record<string, any>;

  @IsNotEmpty({ message: 'L\'ID de la clinique est requis' })
  @IsUUID(4, { message: 'ID de clinique invalide' })
  clinicId: string;
}
