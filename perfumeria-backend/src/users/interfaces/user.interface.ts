export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  passwordHash: string;
  telefono: string | null;
  role: UserRole;
  activo: boolean;
  createdAt: Date;
}

export type UserRole = 'ADMIN' | 'USER';
