import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterDoctorDto } from '../users/dto/register-doctor.dto';
import { RegisterPatientDto } from '../users/dto/register-patient.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { UserRole } from '../users/user.entity';
import { Public } from '../common/decorators/public.decorator';

type AuthResponse = {
  access_token: string;
  user: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
    clinicId?: string | null;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register/patient')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registerPatient(@Body() registerPatientDto: RegisterPatientDto) {
    return this.authService.register({
      ...registerPatientDto,
      role: UserRole.PATIENT
    });
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.register(createUserDto);
  }

  @Post('register/doctor')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registerDoctor(@Body() registerDoctorDto: RegisterDoctorDto): Promise<AuthResponse> {
    return this.authService.registerDoctor(registerDoctorDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
