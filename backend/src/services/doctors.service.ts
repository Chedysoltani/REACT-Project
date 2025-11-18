import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    // Vérifier si l'email existe déjà
    const existingDoctor = await this.doctorRepository.findOne({ 
      where: { email: createDoctorDto.email } 
    });
    
    if (existingDoctor) {
      throw new ConflictException('Un médecin avec cet email existe déjà');
    }

    // Vérifier si la clinique existe
    const clinic = await this.clinicRepository.findOne({
      where: { id: createDoctorDto.clinicId }
    });

    if (!clinic) {
      throw new NotFoundException('Clinique non trouvée');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);

    // Créer le médecin
    const doctor = new Doctor();
    doctor.firstName = createDoctorDto.firstName;
    doctor.lastName = createDoctorDto.lastName;
    doctor.email = createDoctorDto.email;
    doctor.password = hashedPassword;
    doctor.address = createDoctorDto.address;
    doctor.phone = createDoctorDto.phone;
    doctor.specialty = createDoctorDto.specialty;
    doctor.clinic = clinic;

    return this.doctorRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({
      relations: ['clinic'],
      select: ['id', 'firstName', 'lastName', 'email', 'address', 'phone', 'specialty', 'createdAt']
    });
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['clinic']
    });

    if (!doctor) {
      throw new NotFoundException(`Médecin avec l'ID ${id} non trouvé`);
    }

    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);
    
    // Si un nouveau mot de passe est fourni, le hasher
    if (updateDoctorDto.password) {
      doctor.password = await bcrypt.hash(updateDoctorDto.password, 10);
    }

    // Si une nouvelle clinique est fournie, vérifier qu'elle existe
    if (updateDoctorDto.clinicId) {
      const clinic = await this.clinicRepository.findOne({
        where: { id: updateDoctorDto.clinicId }
      });

      if (!clinic) {
        throw new NotFoundException('Clinique non trouvée');
      }
      
      doctor.clinic = clinic;
    }

    // Mettre à jour les champs fournis
    if (updateDoctorDto.firstName) doctor.firstName = updateDoctorDto.firstName;
    if (updateDoctorDto.lastName) doctor.lastName = updateDoctorDto.lastName;
    if (updateDoctorDto.email) doctor.email = updateDoctorDto.email;
    if (updateDoctorDto.address) doctor.address = updateDoctorDto.address;
    if (updateDoctorDto.phone) doctor.phone = updateDoctorDto.phone;
    if (updateDoctorDto.specialty) doctor.specialty = updateDoctorDto.specialty;
    
    return this.doctorRepository.save(doctor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.doctorRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Médecin avec l'ID ${id} non trouvé`);
    }
  }

  async findByClinic(clinicId: string): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { clinic: { id: clinicId } },
      relations: ['clinic'],
      select: ['id', 'firstName', 'lastName', 'email', 'address', 'phone', 'specialty', 'createdAt']
    });
  }

  async findBySpecialty(specialty: string): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { specialty },
      relations: ['clinic'],
      select: ['id', 'firstName', 'lastName', 'email', 'address', 'phone', 'specialty', 'createdAt', 'clinic']
    });
  }
}
