import { PartialType } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';
import { CreateDoctorDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  // Le mot de passe est optionnel pour la mise à jour
  @IsOptional()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password?: string;
}
