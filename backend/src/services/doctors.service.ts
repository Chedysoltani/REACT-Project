import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Clinic } from '../clinics/entities/clinic.entity';
import { CreateDoctorDto } from '../users/dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<User> {
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await this.userRepository.findOne({ 
      where: { email: createDoctorDto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Vérifier si la clinique existe
    const clinic = await this.clinicRepository.findOne({
      where: { id: createDoctorDto.clinicId }
    });

    if (!clinic) {
      throw new NotFoundException('Clinique non trouvée');
    }

    // Créer et sauvegarder l'utilisateur avec le rôle de médecin
    const user = new User();
    user.firstName = createDoctorDto.firstName;
    user.lastName = createDoctorDto.lastName;
    user.email = createDoctorDto.email;
    user.password = createDoctorDto.password; // Let the @BeforeInsert hook handle hashing
    user.role = UserRole.DOCTOR;
    user.clinicId = clinic.id;
    
    // Ajouter les champs spécifiques aux médecins
    user.specialty = createDoctorDto.specialty;
    user.phone = createDoctorDto.phone || '';
    user.bio = createDoctorDto.bio || '';
    user.photo = createDoctorDto.photo || '';
    user.workingHours = createDoctorDto.workingHours || {};

    // Sauvegarder l'utilisateur - le mot de passe sera hashé par le hook @BeforeInsert
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.DOCTOR },
      relations: ['clinic'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<User> {
    const doctor = await this.userRepository.findOne({
      where: { id, role: UserRole.DOCTOR },
      relations: ['clinic']
    });
    
    if (!doctor) {
      throw new NotFoundException(`Médecin avec l'ID ${id} non trouvé`);
    }
    
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<User> {
    const doctor = await this.userRepository.findOne({ 
      where: { id, role: UserRole.DOCTOR },
      relations: ['clinic']
    });
    
    if (!doctor) {
      throw new NotFoundException(`Médecin avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour les champs du médecin
    Object.assign(doctor, updateDoctorDto);
    
    // Si la clinique est mise à jour
    if (updateDoctorDto.clinicId && updateDoctorDto.clinicId !== doctor.clinic?.id) {
      const clinic = await this.clinicRepository.findOne({
        where: { id: updateDoctorDto.clinicId }
      });
      
      if (!clinic) {
        throw new NotFoundException('Clinique non trouvée');
      }
      
      doctor.clinic = clinic;
      doctor.clinicId = clinic.id;
    }
    
    // Sauvegarder les modifications
    return await this.userRepository.save(doctor);
  }

  async remove(id: number): Promise<void> {
    // Trouver le médecin avec l'utilisateur associé
    const doctor = await this.userRepository.findOne({
      where: { id, role: UserRole.DOCTOR },
      relations: ['clinic']
    });

    if (!doctor) {
      throw new NotFoundException(`Médecin avec l'ID ${id} non trouvé`);
    }

    // Démarrer une transaction pour assurer l'intégrité des données
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Supprimer l'utilisateur associé s'il existe
      await queryRunner.manager.delete(User, id);
      
      // Valider la transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // En cas d'erreur, annuler la transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Libérer le queryRunner
      await queryRunner.release();
    }
  }

  async findByClinic(clinicId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { 
        role: UserRole.DOCTOR,
        clinic: { id: clinicId } 
      },
      relations: ['clinic']
    });
  }

  async findBySpecialty(specialty: string): Promise<User[]> {
    return this.userRepository.find({
      where: { 
        role: UserRole.DOCTOR,
        specialty 
      },
      relations: ['clinic']
    });
  }
}
