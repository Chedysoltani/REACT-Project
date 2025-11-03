import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Créer une réservation
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReservationDto, @Req() req) {
    const patientId = req.user.id;
    return this.reservationsService.createReservation(patientId, dto);
  }

  // Récupérer toutes les réservations (admin)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  // Récupérer les réservations du patient connecté
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyReservations(@Req() req) {
    const patientId = req.user.id;
    return this.reservationsService.findByPatient(patientId);
  }

  // Récupérer les réservations pour le médecin connecté
  @UseGuards(JwtAuthGuard)
  @Get('me/medecin')
  findReservationsForMedecin(@Req() req: any) {
    const medecinId = req.user.id;
    return this.reservationsService.findByMedecin(medecinId);
  }
}
