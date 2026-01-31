import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Username for authentication',
        example: 'johndoe',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'User password',
        example: 'StrongPass123!',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
