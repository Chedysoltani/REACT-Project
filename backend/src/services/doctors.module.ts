import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './doctors.service';
import { DoctorController } from './doctors.controller';
import { Doctor } from './doctor.entity';
import { Clinic } from '../clinics/entities/clinic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Clinic]),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorsModule {}

