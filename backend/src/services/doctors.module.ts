import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './doctors.service';
import { DoctorController } from './doctors.controller';

import { Doctor } from './doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  controllers: [DoctorController],   // correspond au nom exact de ta classe
  providers: [DoctorService],        // correspond au nom exact de ta classe
  exports: [DoctorService],
})
export class DoctorsModule {}

