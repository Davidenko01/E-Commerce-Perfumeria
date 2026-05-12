import { UserRole } from './user.interface';

export interface UsuarioResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  role: UserRole;
  activo: boolean;
  createdAt: Date;
}
