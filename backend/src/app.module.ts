import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
// Les références à Doctor ont été supprimées car nous utilisons maintenant User avec le rôle DOCTOR
import { ReservationsModule } from './Reservation/reservations.module';
import { Reservation } from './Reservation/reservation.entity';
import { ClinicsModule } from './clinics/clinics.module';
import { Clinic } from './clinics/entities/clinic.entity';
import { AdminModule } from './admin/admin.module';
import { DoctorsModule } from './services/doctors.module';
import { Patient } from './patients/patient.entity';
import { Doctor } from './services/doctor.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'nest_auth'),
        entities: [User, Reservation, Clinic, Patient, Doctor],
        synchronize: false,
        logging:
          configService.get<string>('NODE_ENV', 'development') == 'development',
      }),
    }),
    UsersModule,
    AuthModule,
    DoctorsModule,
    ReservationsModule,
    ClinicsModule,
    AdminModule,
  ],
  controllers: [AppController, AuthController],
})
export class AppModule {}
