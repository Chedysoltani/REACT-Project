import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;

  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role: UserRole;

  @IsOptional()
  @IsInt({ message: 'ID de clinique invalide' })
  @Min(1, { message: 'ID de clinique invalide' })
  clinicId?: number;
}
