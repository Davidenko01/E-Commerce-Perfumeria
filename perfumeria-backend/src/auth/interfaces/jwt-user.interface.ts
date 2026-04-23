import { UserRole } from '../../users/interfaces/user.interface';

export interface JwtUser {
  id: number;
  email: string;
  role: UserRole;
}
