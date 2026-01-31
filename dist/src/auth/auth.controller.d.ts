import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(req: any): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        access_token: string;
        refresh_token: string;
    }>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(user: any): any;
}
