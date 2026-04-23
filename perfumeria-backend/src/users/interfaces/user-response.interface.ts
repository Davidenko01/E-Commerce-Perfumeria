import { UserRole } from './user.interface';

export interface UsuarioResponse {
  id: number;
  email: string;
  nombre: string;
  telefono: string | null;
  role: UserRole;
  activo: boolean;
  createdAt: Date;
}
