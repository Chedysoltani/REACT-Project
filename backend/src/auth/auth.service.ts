import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterDoctorDto } from '../users/dto/register-doctor.dto';
import { User, UserRole } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Clinic } from '../clinics/entities/clinic.entity';

type JwtPayload = { 
  sub: number; 
  email: string; 
  firstName: string | null; 
  lastName: string | null;
  role: string;
  clinicId?: string | null;
};

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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log(`[Auth] Tentative de connexion pour l'email: ${email}`);
    
    try {
      const user = await this.userRepository.createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email: email.toLowerCase().trim() })
        .getOne();
      
      if (!user) {
        console.log(`[Auth] Aucun utilisateur trouvé avec l'email: ${email}`);
        return null;
      }
      
      console.log(`[Auth] Utilisateur trouvé:`, { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        hasPassword: !!user.password 
      });
      
      if (!user.password) {
        console.error(`[Auth] Aucun mot de passe défini pour l'utilisateur: ${user.email}`);
        return null;
      }
      
      console.log('[Auth] Vérification du mot de passe...');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        console.log(`[Auth] Connexion réussie pour: ${user.email} (${user.role})`);
        // Ne pas renvoyer le mot de passe dans le résultat
        const { password, ...result } = user;
        return result;
      } else {
        console.warn(`[Auth] Échec de l'authentification: mot de passe incorrect pour ${user.email}`);
        return null;
      }
    } catch (error) {
      console.error('[Auth] Erreur lors de la validation de l\'utilisateur:', error);
      return null;
    }
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const { firstName, lastName, email, password, role, clinicId } = createUserDto;

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

    // Créer l'utilisateur avec les données fournies
    // Le hachage du mot de passe sera géré par le hook @BeforeInsert de l'entité User
    const user = await this.usersService.create({
      firstName,
      lastName,
      email,
      password, // Le mot de passe sera hashé par le hook @BeforeInsert
      role,
      clinicId
    });

    return this.generateAuthResponse(user);
  }

  async registerDoctor(registerDoctorDto: RegisterDoctorDto): Promise<AuthResponse> {
    const { firstName, lastName, email, password, specialty, clinicId, address, phone, bio, photo, workingHours, rppsNumber, diploma, languages } = registerDoctorDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Vérifier que la clinique existe
    const clinic = await this.clinicsRepository.findOne({ where: { id: clinicId } });
    if (!clinic) {
      throw new BadRequestException('Clinique non trouvée');
    }

    // Créer l'utilisateur avec les données fournies
    // Le hachage du mot de passe sera géré par le hook @BeforeInsert de l'entité User
    const user = await this.usersService.create({
      firstName,
      lastName,
      email,
      password, // Le mot de passe sera hashé par le hook @BeforeInsert
      role: UserRole.DOCTOR,
      clinicId,
      phone: phone || '',
      specialty
    });
    
    // Mettre à jour les champs spécifiques aux médecins
    user.bio = bio || '';
    user.photo = photo || '';
    user.workingHours = workingHours || {};
    user.rppsNumber = rppsNumber || '';
    user.diploma = diploma || '';
    user.languages = languages || [];

    // Sauvegarder l'utilisateur
    const savedUser = await this.userRepository.save(user);

    // Générer le token JWT avec des valeurs par défaut pour les champs nullables
    const payload: JwtPayload = {
      sub: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName || '',
      lastName: savedUser.lastName || '',
      role: savedUser.role,
      clinicId: savedUser.clinicId || undefined
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        clinicId: savedUser.clinicId || undefined
      }
    };
  }

  async login(user: any): Promise<AuthResponse> {
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: User): AuthResponse {
    // Fournir des valeurs par défaut pour les champs nullables
    const payload: JwtPayload = { 
      sub: user.id, 
      email: user.email, 
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      clinicId: user.clinicId || undefined
    };
    
    const token = this.jwtService.sign(payload);

    return { 
      access_token: token, 
      user: { 
        id: user.id, 
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email, 
        role: user.role,
        clinicId: user.clinicId || undefined
      } 
    };
  }
}
