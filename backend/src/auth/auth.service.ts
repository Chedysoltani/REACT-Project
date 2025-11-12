import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserRole } from '../users/user.entity';

type JwtPayload = { sub: number; email: string; name: string; };

type AuthResponse = {
  access_token: string;
  user: { id: number; name: string; email: string; role: string; };
};

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException('Un utilisateur avec cet email existe déjà');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create(
      name,
      email,
      hashedPassword,
      UserRole.PATIENT, // ⚡ rôle forcé à patient
    );

    return this.generateAuthResponse(user);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: User): AuthResponse {
    const payload: JwtPayload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);

    return { access_token: token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
}
