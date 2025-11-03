import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  medecinId: number;

  @IsNotEmpty()
  @IsString()
  date: string; // format YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  heure: string; // format HH:mm
}
