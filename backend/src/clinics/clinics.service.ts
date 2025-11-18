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
    
    // Associer l'admin à la clinique
    await this.usersRepository.update(adminId, { 
      clinicId: savedClinic.id as unknown as number 
    });
    
    return savedClinic;
  }

  async findAll(): Promise<Clinic[]> {
    try {
      return await this.clinicsRepository.find({
        relations: ['staff'],
        select: ['id', 'name', 'address', 'phone', 'email', 'createdAt', 'updatedAt'],
        order: { name: 'ASC' }
      });
    } catch (error) {
      console.error('Error in ClinicsService.findAll:', error);
      throw new Error('Failed to retrieve clinics');
    }
  }

  async findOne(id: string): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({
      where: { id } as FindOptionsWhere<Clinic>,
      relations: ['staff'],
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

    // Mise à jour des champs fournis
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
    const clinic = await this.findOne(clinicId);
    
    // Récupérer uniquement les utilisateurs avec le rôle 'doctor' pour cette clinique
    const doctors = await this.usersRepository.find({
      where: {
        clinicId: clinic.id as unknown as number,
        role: UserRole.DOCTOR
      },
      select: ['id', 'name', 'email', 'role', 'createdAt']
    });
    
    return doctors;
  }

  async findByUserId(userId: number): Promise<Clinic | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['clinic']
    });
    
    return user?.clinic || null;
  }

  async addStaff(clinicId: string, userId: number): Promise<Clinic> {
    const clinic = await this.findOne(clinicId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    user.clinic = clinic;
    await this.usersRepository.save(user);
    
    return this.findOne(clinicId);
  }
}
