import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, prisma: PrismaService);
    validateUser(username: string, password: string): Promise<any>;
    generateTokens(userId: string, username: string, email: string, role: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(user: any): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        access_token: string;
        refresh_token: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    revokeAllUserTokens(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
