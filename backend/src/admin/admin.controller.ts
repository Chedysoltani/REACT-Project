import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    const [stats, recentUsers, recentClinics] = await Promise.all([
      this.adminService.getDashboardStats(),
      this.adminService.getRecentUsers(),
      this.adminService.getRecentClinics(),
    ]);

    return {
      stats,
      recentUsers,
      recentClinics,
    };
  }
}
