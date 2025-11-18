import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../users/user.entity';

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  clinicId?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // S'assurer que le rôle est défini
    if (!payload.role) {
      throw new Error('No role found in JWT payload');
    }

    // Convertir l'ID de l'utilisateur en nombre
    const userId = parseInt(payload.sub, 10);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID in JWT payload');
    }

    return { 
      userId: userId, 
      email: payload.email,
      name: payload.name,
      role: payload.role,
      clinicId: payload.clinicId
    };
  }
}
