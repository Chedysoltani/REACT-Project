// doctor.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { DoctorService } from '../services/doctors.service';
import { Doctor } from './doctor.entity';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  async createDoctor(@Body() body: any) {
    // Appelle le service pour créer le médecin
    return this.doctorService.createDoctor(body);
  }
  @Get()
  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorService.getAllDoctors();
  }
}
