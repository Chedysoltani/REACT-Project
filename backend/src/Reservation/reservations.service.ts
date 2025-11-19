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
      doctor: { id: dto.doctorId },
      dateReservation: dto.date,
    });
    return this.reservationRepo.save(reservation);
  }

  async findAll() {
    return this.reservationRepo.find({ 
      relations: ['patient', 'doctor'],
      where: {
        doctor: {
          role: 'doctor' as any // Type assertion pour le rôle
        }
      }
    });
  }

  async findByPatient(patientId: number) {
    return this.reservationRepo.find({
      where: { patient: { id: patientId } },
      relations: ['medecin'],
    });
  }
  async findByDoctor(doctorId: number) {
    return this.reservationRepo.find({
      where: { doctor: { id: doctorId } },
      relations: ['patient', 'doctor'], // inclut les infos du patient et du médecin
    });
  }

}
