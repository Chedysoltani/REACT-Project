// src/patients/patients.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../patients/patient.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  // ✅ Crée automatiquement un patient pour un user donné
  async createForUser(user: User): Promise<Patient> {
    const patient = this.patientRepository.create({ user });
    return this.patientRepository.save(patient);
  }

  // Optionnel : récupérer tous les patients avec leurs users
  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({ relations: ['user'] });
  }

  // Optionnel : récupérer un patient par user ID
async findByUserId(userId: number): Promise<Patient | null> {
  return this.patientRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });
}

}
