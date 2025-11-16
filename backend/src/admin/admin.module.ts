import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { Doctor } from '../services/doctor.entity';
import { Patient } from '../patients/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Clinic, Doctor, Patient]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
