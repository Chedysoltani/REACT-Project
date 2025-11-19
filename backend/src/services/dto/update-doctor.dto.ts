import { IsOptional, IsString, IsUUID, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email invalide' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

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
  @IsString()
  photo?: string;

  @IsOptional()
  workingHours?: Record<string, any>;

  @IsOptional()
  @IsString()
  rppsNumber?: string;

  @IsOptional()
  @IsString()
  diploma?: string;

  @IsOptional()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsUUID(4, { message: 'ID de clinique invalide' })
  clinicId?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Rôle utilisateur invalide' })
  role?: UserRole;
}
