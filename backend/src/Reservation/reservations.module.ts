import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { User } from 'src/users/user.entity';
import { Doctor } from 'src/services/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Doctor])],
  providers: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
