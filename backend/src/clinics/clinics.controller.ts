import { 
  Controller, 
  Get, 
  Post, 
  Patch,
  Body, 
  Param, 
  UseGuards, 
  Req, 
  ParseIntPipe, 
  HttpStatus, 
  HttpCode, 
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus as NestHttpStatus
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { Request } from 'express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';

// Définition du type pour la requête utilisateur authentifié
interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
    name: string;
    role: string;
    clinicId?: number;
    [key: string]: any;
  };
}
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { Clinic } from './entities/clinic.entity';

@ApiTags('clinics')
@ApiBearerAuth()
@Controller('clinics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new clinic' })
  @ApiResponse({ status: 201, description: 'The clinic has been successfully created.' })
  async create(
    @Body() createClinicDto: CreateClinicDto, 
    @Req() req: AuthenticatedRequest
  ): Promise<{ clinic: Clinic; message: string }> {
    try {
      const clinic = await this.clinicsService.create(createClinicDto, req.user.userId);
      return {
        clinic,
        message: 'Clinic created successfully'
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a clinic' })
  @ApiParam({ name: 'id', description: 'Clinic ID' })
  @ApiResponse({ status: 200, description: 'The clinic has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async update(
    @Param('id') id: string,
    @Body() updateClinicDto: UpdateClinicDto,
    @Req() req: AuthenticatedRequest
  ): Promise<{ clinic: Clinic; message: string }> {
    try {
      const clinic = await this.clinicsService.update(id, updateClinicDto);
      return {
        clinic,
        message: 'Clinic updated successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to update clinic');
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all clinics' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all clinics',
    type: [Clinic]
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Internal server error occurred'
  })
  async findAll(@Req() req: AuthenticatedRequest): Promise<Clinic[]> {
    try {
      console.log('=== ClinicsController.findAll ===');
      console.log('User:', req.user);
      console.log('User role:', req.user?.role);
      console.log('User clinicId:', req.user?.clinicId);
      
      console.log('Calling clinicsService.findAll()...');
      const clinics = await this.clinicsService.findAll();
      console.log(`Successfully retrieved ${clinics.length} clinics`);
      
      // Log des premières cliniques pour le débogage
      if (clinics.length > 0) {
        console.log('First clinic sample:', {
          id: clinics[0].id,
          name: clinics[0].name,
          users: clinics[0].users ? clinics[0].users.length : 0
        });
      }
      
      return clinics;
    } catch (error) {
      console.error('=== ERROR in ClinicsController.findAll ===');
      console.error('Error details:', error);
      
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
        throw new HttpException(
          `Failed to fetch clinics: ${error.message}`, 
          NestHttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      
      throw new HttpException(
        'An unexpected error occurred while fetching clinics', 
        NestHttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get clinic by ID' })
  @ApiParam({ name: 'id', description: 'Clinic ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return clinic by ID',
    type: Clinic
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Clinic not found' 
  })
  async findOne(
    @Param('id') id: string
  ): Promise<{ clinic: Clinic }> {
    try {
      const clinic = await this.clinicsService.findOne(id);
      if (!clinic) {
        throw new NotFoundException(`Clinic with ID ${id} not found`);
      }
      return { clinic };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Invalid clinic ID');
    }
  }

  @Post(':id/staff/:userId')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Add a staff member to a clinic' })
  @ApiParam({ name: 'id', description: 'Clinic ID' })
  @ApiParam({ name: 'userId', description: 'User ID to add as staff' })
  @ApiResponse({ status: 200, description: 'Staff member added successfully' })
  @ApiResponse({ status: 404, description: 'Clinic or user not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async addStaff(
    @Param('id') clinicId: string,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: AuthenticatedRequest
  ) {
    // Vérifier que l'utilisateur a le droit d'ajouter du personnel à cette clinique
    if (req.user.role === UserRole.RECEPTIONIST) {
      const userClinic = await this.clinicsService.findByUserId(req.user.userId);
      if (!userClinic || userClinic.id !== clinicId) {
        throw new ForbiddenException('You can only add staff to your own clinic');
      }
    }
    
    return this.clinicsService.addStaff(clinicId, userId);
  }

  @Get(':id/doctors')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get all doctors for a clinic' })
  @ApiParam({ name: 'id', description: 'Clinic ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of doctors in the clinic',
    type: [User]
  })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  async getDoctors(@Param('id') clinicId: string) {
    return this.clinicsService.getDoctors(clinicId);
  }
}
