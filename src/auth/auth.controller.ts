import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'uuid',
                    username: 'johndoe',
                    email: 'user@example.com',
                },
            },
        },
    })
    @ApiResponse({ status: 409, description: 'User already exists' })
    @ApiResponse({ status: 400, description: 'Bad request / Validation error' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login with username and password' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'User successfully authenticated',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'uuid',
                    username: 'johndoe',
                    email: 'user@example.com',
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'Returns the current authenticated user',
        schema: {
            example: {
                id: 'uuid',
                username: 'johndoe',
                email: 'user@example.com',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(@CurrentUser() user: any) {
        return user;
    }
}
