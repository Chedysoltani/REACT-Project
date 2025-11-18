import { Controller, Get, UseGuards, Req, Patch, Param, Body, NotFoundException, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User, UserRole } from './user.entity';

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
  @Get('doctors')
  findDoctors() {
    return this.usersService.findByRoles([UserRole.DOCTOR]);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<User>
  ) {
    try {
      // Vérifier que l'utilisateur existe
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Mettre à jour uniquement les champs fournis
      const updatedUser = await this.usersService.update(id, updateData);
      return {
        user: updatedUser,
        message: 'User updated successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to update user');
    }
  }
}
