import { Role } from '../../auth/enums/role.enum';
export declare class CreateUserDto {
    email: string;
    username: string;
    password: string;
    role?: Role;
}
