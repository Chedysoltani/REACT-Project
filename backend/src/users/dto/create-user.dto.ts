import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsUUID, IsString } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName: string;

  @IsNotEmpty({ message: 'Le nom de famille est requis' })
  lastName: string;

  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role: UserRole;

  @IsOptional()
  @IsUUID(4, { message: 'ID de clinique invalide' })
  clinicId?: string;

  @IsOptional()
  @IsString({ message: 'La spécialité doit être une chaîne de caractères' })
  specialty?: string;

  @IsOptional()
  @IsString({ message: 'Le numéro de téléphone doit être une chaîne de caractères' })
  phone?: string;
}
