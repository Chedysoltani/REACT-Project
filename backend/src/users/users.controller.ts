import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Req, 
  UsePipes, 
  ValidationPipe, 
  ParseIntPipe, 
  Param, 
  Patch, 
  BadRequestException, 
  ConflictException,
  NotFoundException,
  Delete,
  HttpCode
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return req.user; // set by JwtStrategy validate()
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('staff')
  async findStaff() {
    // Récupérer tous les rôles sauf ADMIN
    const allRolesExceptAdmin = Object.values(UserRole).filter(role => role !== UserRole.ADMIN);
    return this.usersService.findByRoles(allRolesExceptAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const { password, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new BadRequestException(error.message || 'Failed to find user');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('doctors')
  findDoctors() {
    return this.usersService.findByRoles([UserRole.DOCTOR]);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/users/:id')
  async findOneForAdmin(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findByIdWithDetails(id);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/users/:id/edit')
  async findOneForEdit(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findByIdWithDetails(id);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/users/:id')
  @HttpCode(204)
  async removeUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ) {
    // Empêcher un utilisateur de se supprimer lui-même
    if (req.user.id === id) {
      throw new BadRequestException('Vous ne pouvez pas supprimer votre propre compte');
    }
    
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    
    await this.usersService.remove(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      // Créer l'utilisateur via le service
      const user = await this.usersService.create(createUserDto);
      
      // Ne pas renvoyer le mot de passe
      const { password, ...result } = user;
      return {
        ...result,
        message: 'Utilisateur créé avec succès'
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Échec de la création de l\'utilisateur');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any
  ) {
    try {
      // Vérifier que l'utilisateur existe
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }

      // Filtrer les champs autorisés pour la mise à jour
      const allowedFields = [
        'firstName', 'lastName', 'email', 'phone', 'specialty', 
        'clinicId', 'bio', 'workingHours', 'rppsNumber', 'diploma', 'languages', 'photo'
      ];
      
      const filteredUpdateData: Record<string, any> = {};
      
      // Ne garder que les champs autorisés et les convertir si nécessaire
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          // Conversion des types si nécessaire
          if (field === 'clinicId' && updateData[field] !== null) {
            filteredUpdateData[field] = String(updateData[field]);
          } else if (field === 'workingHours' && updateData[field]) {
            // S'assurer que workingHours est un objet valide
            try {
              filteredUpdateData[field] = typeof updateData[field] === 'string' 
                ? JSON.parse(updateData[field]) 
                : updateData[field];
            } catch (e) {
              console.error('Erreur de parsing de workingHours:', e);
              throw new BadRequestException('Format de workingHours invalide');
            }
          } else {
            filteredUpdateData[field] = updateData[field];
          }
        }
      }

      // Mettre à jour l'utilisateur
      const updatedUser = await this.usersService.update(id, filteredUpdateData);
      
      return {
        user: updatedUser,
        message: 'Utilisateur mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      
      throw new BadRequestException(error.message || 'Échec de la mise à jour de l\'utilisateur');
    }
  }
}
