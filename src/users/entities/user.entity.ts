import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Role } from '@prisma/client';
import { Role as RoleEnum } from '../../auth/enums/role.enum';

export class UserEntity {
    @ApiProperty({ example: 'uuid-string' })
    id: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: 'johndoe' })
    username: string;

    @Exclude()
    password: string;

    @ApiProperty({ enum: RoleEnum, example: RoleEnum.USER })
    role: Role;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
