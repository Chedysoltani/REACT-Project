import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { UserRole } from '../user.entity';

export class RegisterDoctorDto {
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Le nom de famille est requis' })
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'L\'email est requis' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString()
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

  @IsNotEmpty({ message: 'L\'ID de la clinique est requis pour un médecin' })
  @IsUUID(4, { message: 'ID de clinique invalide' })
  clinicId: string;

  // Champ role avec une valeur par défaut
  role: UserRole.DOCTOR = UserRole.DOCTOR;
}
