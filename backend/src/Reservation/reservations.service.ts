import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  // 🔹 Déclaration correcte du repository
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>, // <-- nécessaire
  ) {}

  async createReservation(patientId: number, dto: CreateReservationDto) {
    const reservation = this.reservationRepo.create({
      patient: { id: patientId },
      medecin: { id: dto.medecinId },
      dateReservation: dto.date, // ou dto.dateReservation selon ton DTO
    });
    return this.reservationRepo.save(reservation);
  }

  async findAll() {
    return this.reservationRepo.find({ relations: ['patient', 'medecin'] });
  }

  async findByPatient(patientId: number) {
    return this.reservationRepo.find({
      where: { patient: { id: patientId } },
      relations: ['medecin'],
    });
  }
  async findByMedecin(medecinId: number) {
  return this.reservationRepo.find({
    where: { medecin: { id: medecinId } },
    relations: ['patient'], // inclut les infos du patient
  });
}

}
