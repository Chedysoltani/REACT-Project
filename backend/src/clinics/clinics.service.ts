import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createClinicDto: CreateClinicDto, adminId: number): Promise<Clinic> {
    const clinic = this.clinicsRepository.create(createClinicDto);
    const savedClinic = await this.clinicsRepository.save(clinic);
    
    // Associate admin with the clinic
    await this.usersRepository.update(adminId, { 
      clinicId: savedClinic.id,
      role: UserRole.CLINIC_ADMIN
    });
    
    return savedClinic;
  }

  async findAll(): Promise<Clinic[]> {
    try {
      console.log('Fetching clinics...');
      
      // Récupérer d'abord les cliniques sans les relations
      const clinics = await this.clinicsRepository.find({
        order: { name: 'ASC' }
      });
      
      console.log(`Found ${clinics.length} clinics`);
      
      // Pour chaque clinique, charger les utilisateurs séparément
      const clinicsWithUsers = await Promise.all(
        clinics.map(async (clinic) => {
          const users = await this.usersRepository.find({
            where: { clinicId: clinic.id },
            select: ['id', 'firstName', 'lastName', 'email', 'role']
          });
          
          return {
            ...clinic,
            users
          };
        })
      );
      
      return clinicsWithUsers;
    } catch (error) {
      console.error('Error in ClinicsService.findAll:', error);
      // Afficher plus de détails sur l'erreur
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      throw new Error('Failed to retrieve clinics');
    }
  }

  async findOne(id: string): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
    
    return clinic;
  }

  async update(id: string, updateClinicDto: Partial<CreateClinicDto>): Promise<Clinic> {
    const clinic = await this.findOne(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    // Update provided fields
    Object.assign(clinic, updateClinicDto);
    
    return this.clinicsRepository.save(clinic);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clinicsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
  }

  async getDoctors(clinicId: string): Promise<User[]> {
    // Vérifier que la clinique existe
    const clinic = await this.clinicsRepository.findOne({ where: { id: clinicId } });
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${clinicId} not found`);
    }
    
    // Récupérer uniquement les utilisateurs avec le rôle 'doctor' pour cette clinique
    return this.usersRepository.find({
      where: {
        clinicId: clinic.id,
        role: UserRole.DOCTOR
      },
      select: [
        'id', 
        'firstName', 
        'lastName', 
        'email', 
        'role', 
        'specialty',
        'phone',
        'createdAt'
      ],
      order: { lastName: 'ASC', firstName: 'ASC' }
    });
  }

  async findByUserId(userId: number): Promise<Clinic | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['clinic']
    });
    
    return user?.clinic || null;
  }

  async addStaff(clinicId: string, userId: number): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({ 
      where: { id: clinicId },
      relations: ['users']
    });
    
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${clinicId} not found`);
    }
    
    const user = await this.usersRepository.findOne({ 
      where: { id: userId },
      relations: ['clinic']
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    user.clinic = clinic;
    await this.usersRepository.save(user);
    
    return clinic;
  }
}