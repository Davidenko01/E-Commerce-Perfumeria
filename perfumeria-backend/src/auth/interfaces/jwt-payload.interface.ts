import { UserRole } from '../../users/interfaces/user.interface';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
