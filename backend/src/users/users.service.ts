import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<User> {
    const user = new User();
    user.name = name;
    user.email = email.toLowerCase();
    user.password = password;
    user.role = role;

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
}
