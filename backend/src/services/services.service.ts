import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const entity = this.serviceRepo.create(dto);
    return this.serviceRepo.save(entity);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepo.remove(service);
  }
}
