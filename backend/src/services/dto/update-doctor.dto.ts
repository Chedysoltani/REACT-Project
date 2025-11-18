import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  // Tous les champs sont rendus optionnels par PartialType
  // On peut ajouter des validations spécifiques à la mise à jour si nécessaire
}
