import { Role } from '@prisma/client';
export declare class UserEntity {
    id: string;
    email: string;
    username: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<UserEntity>);
}
