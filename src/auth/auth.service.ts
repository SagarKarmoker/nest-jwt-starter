import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async generateTokens(userId: string, username: string, email: string, role: string) {
        const payload = {
            username,
            sub: userId,
            email,
            role,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.secret'),
            expiresIn: this.configService.get<string>('jwt.expiresIn'),
        } as any);

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('refreshToken.secret'),
            expiresIn: this.configService.get<string>('refreshToken.expiresIn'),
        } as any);

        // Store refresh token in database
        const expiresInDays = parseInt(this.configService.get<string>('refreshToken.expiresIn')!) || 7;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
            },
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async login(user: any) {
        const tokens = await this.generateTokens(
            user.id,
            user.username,
            user.email,
            user.role,
        );

        return {
            ...tokens,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);
        return this.login(user);
    }

    async refreshTokens(refreshToken: string) {
        try {
            // Verify token signature
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('refreshToken.secret')!,
            });

            // Check if token exists in database and is not revoked
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
                include: { user: true },
            });

            if (!storedToken || storedToken.isRevoked) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            if (storedToken.expiresAt < new Date()) {
                throw new UnauthorizedException('Refresh token expired');
            }

            // Revoke old refresh token (token rotation)
            await this.prisma.refreshToken.update({
                where: { token: refreshToken },
                data: { isRevoked: true },
            });

            // Generate new tokens
            const newTokens = await this.generateTokens(
                storedToken.user.id,
                storedToken.user.username,
                storedToken.user.email,
                storedToken.user.role,
            );

            return {
                ...newTokens,
                user: {
                    id: storedToken.user.id,
                    username: storedToken.user.username,
                    email: storedToken.user.email,
                    role: storedToken.user.role,
                },
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(refreshToken: string) {
        await this.prisma.refreshToken.updateMany({
            where: { token: refreshToken },
            data: { isRevoked: true },
        });

        return { message: 'Logged out successfully' };
    }

    async revokeAllUserTokens(userId: string) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });

        return { message: 'All refresh tokens revoked' };
    }

    // Password Reset Methods
    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            // Don't reveal if email exists or not
            return { message: 'If the email exists, a password reset link has been sent' };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

        await this.prisma.passwordResetToken.create({
            data: {
                token: resetToken,
                userId: user.id,
                expiresAt,
            },
        });

        // TODO: Send email with reset link
        // For now, log to console
        console.log(`
========================================
PASSWORD RESET EMAIL
========================================
To: ${email}
Reset Token: ${resetToken}
Reset Link: http://localhost:3000/reset-password?token=${resetToken}
Expires: ${expiresAt.toISOString()}
========================================
        `);

        return { message: 'If the email exists, a password reset link has been sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken || resetToken.used) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (resetToken.expiresAt < new Date()) {
            throw new BadRequestException('Reset token has expired');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword },
        });

        // Mark token as used
        await this.prisma.passwordResetToken.update({
            where: { token },
            data: { used: true },
        });

        // Revoke all refresh tokens for security
        await this.revokeAllUserTokens(resetToken.userId);

        return { message: 'Password reset successfully' };
    }
}
