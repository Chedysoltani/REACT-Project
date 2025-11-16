import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { Doctor } from '../services/doctor.entity';
import { Patient } from '../patients/patient.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalClinics, totalDoctors, totalPatients] = await Promise.all([
      this.usersRepository.count(),
      this.clinicsRepository.count(),
      this.doctorsRepository.count(),
      this.patientsRepository.count(),
    ]);

    return {
      totalUsers,
      totalClinics,
      totalDoctors,
      totalPatients,
    };
  }

  async getRecentUsers(limit = 5) {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRecentClinics(limit = 5) {
    return this.clinicsRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['staff'],
    });
  }
}
