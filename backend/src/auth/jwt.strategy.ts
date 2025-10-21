import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

type RequestWithAuth = {
  headers: {
    authorization?: string;
  };
};

type JwtPayload = {
  sub: number;
  email: string;
  name: string;
};

type SanitizedUser = Omit<User, 'password'> | null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    const jwtFromRequest = (req: RequestWithAuth): string | null => {
      try {
        const authHeader = req?.headers?.authorization || '';
        if (authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7); // Remove 'Bearer ' prefix
        }
        return null;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error extracting JWT token:', error.message);
        } else {
          console.error('Unknown error extracting JWT token');
        }
        return null;
      }
    };

    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<SanitizedUser> {
    try {
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      // Exclure le mot de passe du résultat
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as SanitizedUser;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new UnauthorizedException(
          `Erreur lors de la validation du token: ${error.message}`,
        );
      }
      
      throw new UnauthorizedException('Erreur inconnue lors de la validation du token');
    }
  }
}
