import { Role } from '../enums/role.enum';
export declare class RegisterDto {
    email: string;
    username: string;
    password: string;
    role?: Role;
}
