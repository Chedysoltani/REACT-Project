import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Crée un nouvel utilisateur
   */
  async create(
    name: string,
    email: string,
    password: string,
    role: UserRole = UserRole.PATIENT,
    clinicId?: number
  ): Promise<User> {
    const user = new User();
    user.name = name;
    user.email = email.toLowerCase();
    user.password = password;
    user.role = role;
    
    // Si un clinicId est fourni, on l'associe à l'utilisateur
    if (clinicId) {
      user.clinic = { id: clinicId } as any;
    }

    try {
      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Une erreur inconnue est survenue';
      throw new Error(
        `Erreur lors de la création de l'utilisateur: ${errorMessage}`,
      );
    }
  }

  /**
   * Trouve un utilisateur par son email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Trouve un utilisateur par son ID
   */
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  /**
   * Liste tous les utilisateurs
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Liste les utilisateurs par rôles (sélectionne uniquement les champs publics)
   */
  async findByRoles(
    roles: UserRole[],
  ): Promise<Array<Pick<User, 'id' | 'name' | 'email' | 'role'>>> {
    return this.usersRepository.find({
      select: { id: true, name: true, email: true, role: true },
      where: { role: In(roles) },
    });
  }

  /**
   * Met à jour un utilisateur
   */
  async update(id: number, updateData: Partial<User>): Promise<User> {
    // Vérifier que l'utilisateur existe
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Ne pas permettre la mise à jour de l'email s'il est fourni
    if (updateData.email) {
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already in use');
      }
    }

    // Mettre à jour uniquement les champs fournis
    Object.assign(user, updateData);
    
    // Sauvegarder les modifications
    return this.usersRepository.save(user);
  }
}
