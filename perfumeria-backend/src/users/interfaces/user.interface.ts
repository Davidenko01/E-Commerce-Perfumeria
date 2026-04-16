export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export type UserRole = 'admin' | 'customer';