import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserRole } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Clinic } from '../clinics/entities/clinic.entity';

type JwtPayload = { sub: number; email: string; name: string; };

type AuthResponse = {
  access_token: string;
  user: { 
    id: number; 
    name: string; 
    email: string; 
    role: string;
    clinicId?: number;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const { name, email, password, role, clinicId } = createUserDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException('Un utilisateur avec cet email existe déjà');

    // Si c'est un médecin, vérifier que la clinique existe
    if (role === UserRole.DOCTOR && !clinicId) {
      throw new BadRequestException('Une clinique doit être sélectionnée pour un médecin');
    }

    // Vérifier que la clinique existe
    if (clinicId) {
      const clinic = await this.clinicsRepository.findOne({ 
        where: { id: clinicId.toString() } 
      });
      if (!clinic) {
        throw new BadRequestException('Clinique non trouvée');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec les données fournies
    const user = await this.usersService.create(
      name,
      email,
      hashedPassword,
      role,
      clinicId
    );

    return this.generateAuthResponse(user);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: User): AuthResponse {
    const payload = { 
      sub: user.id.toString(), 
      email: user.email, 
      name: user.name,
      role: user.role,
      clinicId: user.clinicId
    };
    
    const token = this.jwtService.sign(payload);

    return { 
      access_token: token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        clinicId: user.clinicId
      } 
    };
  }
}
