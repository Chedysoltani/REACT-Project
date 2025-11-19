import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { Patient } from '../patients/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Clinic, Patient]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
