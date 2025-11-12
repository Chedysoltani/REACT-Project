// doctor.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async createDoctor(data: any) {
    const doctor = new Doctor();
    doctor.name = data.name || 'Unknown';
    doctor.specialty = data.specialty || 'Unknown';
    doctor.email = data.email || null;
    doctor.password = data.password || null;

    return await this.doctorRepository.save(doctor);
  }
  async getAllDoctors(): Promise<Doctor[]> {
  return this.doctorRepository.find();
}

}
