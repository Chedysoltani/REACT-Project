import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
  clinicId?: string | number;
  phone?: string;
  specialty?: string;
}

interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  clinicId?: string | number | null;
  phone?: string | null;
  specialty?: string | null;
  bio?: string | null;
  workingHours?: string | null;
  rppsNumber?: string | null;
  diploma?: string | null;
  languages?: string | null;
  photo?: string | null;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Crée un nouvel utilisateur
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password, role = UserRole.PATIENT, clinicId, phone, specialty } = createUserDto;
    
    console.log(`Création d'un nouvel utilisateur: ${email} (rôle: ${role})`);
    
    // Vérifier si l'email est déjà utilisé
    const existingUser = await this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      console.log(`Tentative de création d'un utilisateur avec un email existant: ${email}`);
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Créer une instance de l'utilisateur
    const user = new User();
    user.firstName = firstName?.trim();
    user.lastName = lastName?.trim();
    user.email = email.toLowerCase().trim();
    
    // Définir le mot de passe (sera hashé par le @BeforeInsert)
    if (password) {
      console.log('Définition du mot de passe pour le nouvel utilisateur');
      user.password = password;
    } else {
      console.warn('Aucun mot de passe fourni pour le nouvel utilisateur');
      // Générer un mot de passe par défaut si aucun n'est fourni
      const defaultPassword = Math.random().toString(36).slice(-8); // Génère un mot de passe aléatoire
      console.log(`Mot de passe par défaut généré pour ${email}`);
      user.password = defaultPassword;
    }
    
    user.role = role;
    if (phone) user.phone = phone.trim();
    if (specialty) user.specialty = specialty.trim();
    
    // Si un clinicId est fourni, on l'associe à l'utilisateur
    if (clinicId) {
      const clinicIdStr = String(clinicId);
      user.clinic = { id: clinicIdStr } as any;
      user.clinicId = clinicIdStr;
    }

    try {
      // Sauvegarder l'utilisateur avec le mot de passe hashé
      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      throw new BadRequestException(`Erreur lors de la création de l'utilisateur: ${errorMessage}`);
    }
  }

  /**
   * Trouve un utilisateur par son email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password') // Inclure le mot de passe dans la sélection
        .where('LOWER(user.email) = LOWER(:email)', { email })
        .getOne();
    } catch (error) {
      console.error('Erreur lors de la recherche par email:', error);
      // En cas d'erreur sur lastLogin, on essaie une requête plus simple
      return this.usersRepository.findOne({
        where: { email },
        select: ['id', 'firstName', 'lastName', 'email', 'password', 'role', 'clinicId']
      });
    }
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

  async findByIdWithDetails(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['clinic'],
      select: [
        'id', 'firstName', 'lastName', 'email', 'role', 'phone',
        'specialty', 'bio', 'photo', 'workingHours', 'rppsNumber',
        'diploma', 'languages', 'createdAt', 'updatedAt', 'clinicId'
      ]
    });
  }

  /**
   * Supprime un utilisateur par son ID
   */
  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
  }

  /**
   * Met à jour un utilisateur existant
   */
  async update(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['clinic']
    });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Liste des champs autorisés pour la mise à jour
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone', 'specialty', 
      'clinicId', 'bio', 'workingHours', 'rppsNumber', 'diploma', 'languages', 'photo'
    ];

    // Vérifier si l'email est modifié et s'il est déjà utilisé
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({ 
        where: { email: updateData.email.toLowerCase() } 
      });
      
      if (existingUser) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }
      user.email = updateData.email.toLowerCase();
    }

    // Mettre à jour uniquement les champs autorisés
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        // Gestion spéciale pour les champs qui peuvent être null
        if (field === 'phone' || field === 'specialty') {
          // Conversion sécurisée en chaîne de caractères pour les champs de type string | null
          user[field] = updateData[field] !== null && updateData[field] !== '' ? String(updateData[field]) : null;
        } else if (field === 'clinicId') {
          // Conversion sécurisée en chaîne de caractères pour clinicId
          user.clinicId = updateData.clinicId ? String(updateData.clinicId) : null;
        } else {
          user[field] = updateData[field];
        }
      }
    }

    // Mise à jour de la relation clinic si clinicId est fourni
    if ('clinicId' in updateData) {
      if (updateData.clinicId) {
        user.clinic = { id: String(updateData.clinicId) } as any;
      } else {
        // Pour éviter les erreurs de typage, on ne fait rien si clinicId est null
        // car la relation sera automatiquement mise à jour par TypeORM
      }
    }

    try {
      const updatedUser = await this.usersRepository.save(user);
      // Ne pas renvoyer le mot de passe
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw new BadRequestException(`Échec de la mise à jour de l'utilisateur: ${error.message}`);
    }
  }

  /**
   * Liste les utilisateurs par rôles (sélectionne uniquement les champs publics)
   */
  async findByRoles(
    roles: UserRole[],
  ): Promise<Array<Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>>> {
    return this.usersRepository.find({
      select: { 
        id: true, 
        firstName: true, 
        lastName: true, 
        email: true, 
        role: true 
      },
      where: { role: In(roles) },
    });
  }


}
