import { UserRole } from "./user.interface";

export interface UserSafe {
    id: number;
    email: string;
    name: string;
    role: UserRole;
}