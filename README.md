# NestJS Backend Starter with RBAC

A production-ready NestJS backend starter template featuring PassportJS authentication, role-based access control (RBAC), Swagger documentation, and Prisma ORM with PostgreSQL.

## Features

- **Authentication** - PassportJS with Local and JWT strategies
- **Advanced Auth** - Refresh tokens with rotation and revocation, password reset flow
- **Role-Based Access Control (RBAC)** - Three role levels (USER, ADMIN, SUPER_ADMIN)
- **Security** - Rate limiting (Throttler), Helmet (standard security headers), Bcrypt hashing
- **Logging** - Structured logging with Winston (File & Console transports)
- **API Documentation** - Interactive Swagger/OpenAPI UI
- **Database** - Prisma ORM with PostgreSQL
- **Validation** - class-validator for DTO validation & transformation
- **Type Safety** - Full TypeScript support with strict mode
- **Professional Structure** - Modular architecture following NestJS best practices

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/SagarKarmoker/nest-jwt-starter.git
cd nest-jwt-starter
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your PostgreSQL credentials:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="15m"

# Refresh Token Configuration
REFRESH_TOKEN_SECRET="your-refresh-token-secret-change-this"
REFRESH_TOKEN_EXPIRATION="7d"

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Logging
LOG_LEVEL="info"

# Application
PORT=3000
NODE_ENV="development"
```

### 4. Run Database Migration

```bash
npx prisma migrate dev
```

This will:
- Create the database tables (Users, RefreshTokens, PasswordResetTokens)
- Generate the Prisma Client with TypeScript types

### 5. Start the Development Server

```bash
pnpm run start:dev
```

The application will start on `http://localhost:3000`

### 6. Access Swagger Documentation

Open your browser and navigate to: **http://localhost:3000/api**

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required | Rate Limit |
|--------|----------|-------------|---------------|------------|
| POST | `/api/v1/auth/register` | Register a new user | No | 3/5min |
| POST | `/api/v1/auth/login` | Login with credentials | No | 5/1min |
| POST | `/api/v1/auth/refresh` | Get new access token | No | Default |
| POST | `/api/v1/auth/logout` | Logout (revoke token) | No | Default |
| POST | `/api/v1/auth/forgot-password`| Request reset email | No | 3/1hr |
| POST | `/api/v1/auth/reset-password` | Reset password | No | 5/1hr |
| GET | `/api/v1/auth/profile` | Get current user profile | Yes | Default |

### Users

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/v1/users` | List all users | Yes | ADMIN, SUPER_ADMIN |
| GET | `/api/v1/users/:id` | Get user by ID | Yes | - |
| DELETE | `/api/v1/users/:id` | Delete user | Yes | SUPER_ADMIN |

## Role-Based Access Control

### Role Hierarchy

1. **USER** (Default)
   - Access own profile
   - View individual users by ID

2. **ADMIN**
   - All USER permissions
   - List all users
   - Manage resources

3. **SUPER_ADMIN**
   - All ADMIN permissions
   - Delete users
   - Full system access

## Logging

Logs are stored in the `logs/` directory:
- `logs/error.log` - Error level logs
- `logs/combined.log` - All logs
- Console - Colored logs for development

## Project Structure

```
src/
├── auth/                      # Authentication module
│   ├── dto/                   # DTOs
│   ├── strategies/            # Passport strategies
│   ├── guards/                # Auth guards
│   ├── decorators/            # Custom decorators
│   ├── enums/                 # Role enum
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                     # Users module
├── prisma/                    # Prisma module
├── logger/                    # Winston logger service
├── common/                    # Shared resources
│   └── middleware/            # Logger middleware
├── config/                    # Configuration
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

## Database Schema

Prisma schema includes:
- **User** - Main user entity
- **RefreshToken** - For maintaining sessions securely
- **PasswordResetToken** - For secure password recovery

## Available Scripts

```bash
# Development
pnpm run start:dev          # Start dev server with hot-reload

# Build
pnpm run build              # Build for production
pnpm run start:prod         # Start production server

# Database
npx prisma migrate dev      # Create and apply migration
npx prisma generate         # Generate Prisma Client
npx prisma studio           # Open Prisma Studio GUI

# Testing
pnpm run test              # Run unit tests
pnpm run test:e2e          # Run E2E tests
pnpm run test:cov          # Test coverage
```

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** PassportJS (Local & JWT)
- **Security:** Helmet, Throttler, Bcrypt
- **Logging:** Winston
- **Documentation:** Swagger/OpenAPI
- **Package Manager:** pnpm

## License

This project is MIT licensed.

## Author

**Sagar Karmoker**
- GitHub: [@SagarKarmoker](https://github.com/SagarKarmoker)
