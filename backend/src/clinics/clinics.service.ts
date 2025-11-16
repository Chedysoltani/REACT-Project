import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { User } from '../users/user.entity';

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
    return this.clinicsRepository.find({
      relations: ['staff'],
    });
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
