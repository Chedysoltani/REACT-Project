import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards, 
  Query,
  ParseIntPipe,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('doctors')
@ApiBearerAuth()
@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CLINIC_ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau médecin' })
  @ApiResponse({ status: 201, description: 'Médecin créé avec succès', type: Doctor })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 409, description: 'Un médecin avec cet email existe déjà' })
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CLINIC_ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Récupérer tous les médecins' })
  @ApiResponse({ status: 200, description: 'Liste des médecins', type: [Doctor] })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async findAll(
    @Query('clinicId') clinicId?: string,
    @Query('specialty') specialty?: string
  ): Promise<Doctor[]> {
    // Implémentation de la recherche par clinique et/ou spécialité si nécessaire
    if (clinicId) {
      return this.doctorService.findByClinic(clinicId);
    }
    if (specialty) {
      return this.doctorService.findBySpecialty(specialty);
    }
    return this.doctorService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CLINIC_ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Récupérer un médecin par son ID' })
  @ApiParam({ name: 'id', description: 'ID du médecin', type: Number })
  @ApiResponse({ status: 200, description: 'Médecin trouvé', type: Doctor })
  @ApiResponse({ status: 404, description: 'Médecin non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    const doctor = await this.doctorService.findOne(id);
    if (!doctor) {
      throw new NotFoundException(`Médecin avec l'ID ${id} non trouvé`);
    }
    return doctor;
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.CLINIC_ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Mettre à jour un médecin' })
  @ApiParam({ name: 'id', description: 'ID du médecin à mettre à jour', type: Number })
  @ApiResponse({ status: 200, description: 'Médecin mis à jour', type: Doctor })
  @ApiResponse({ status: 404, description: 'Médecin non trouvé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CLINIC_ADMIN)
  @ApiOperation({ summary: 'Supprimer un médecin' })
  @ApiParam({ name: 'id', description: 'ID du médecin à supprimer', type: Number })
  @ApiResponse({ status: 200, description: 'Médecin supprimé' })
  @ApiResponse({ status: 404, description: 'Médecin non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.doctorService.remove(id);
  }
}
