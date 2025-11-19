import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, User]),
  ],
  // Pas besoin d'exporter DoctorService car nous allons le gérer via UserService
  exports: [TypeOrmModule],
})
export class DoctorsModule {}