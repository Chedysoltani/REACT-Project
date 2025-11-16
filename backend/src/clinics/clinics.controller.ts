import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Req, 
  ParseIntPipe, 
  HttpStatus, 
  HttpCode, 
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
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
    [key: string]: any;
  };
}
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
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

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all clinics' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all clinics',
    type: [Clinic]
  })
  async findAll(): Promise<{ clinics: Clinic[] }> {
    try {
      const clinics = await this.clinicsService.findAll();
      return { clinics };
    } catch (error) {
      throw new BadRequestException('Failed to fetch clinics');
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
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add staff to clinic' })
  @ApiParam({ name: 'id', description: 'Clinic ID' })
  @ApiParam({ name: 'userId', description: 'User ID to add as staff' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Staff added to clinic successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Clinic or user not found' 
  })
  async addStaff(
    @Param('id') clinicId: string,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string }> {
    try {
      await this.clinicsService.addStaff(clinicId, userId);
      return { message: 'Staff added to clinic successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to add staff to clinic');
    }
  }
}
