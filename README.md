# NestJS Backend Starter with RBAC

A production-ready NestJS backend starter template featuring PassportJS authentication, role-based access control (RBAC), Swagger documentation, and Prisma ORM with PostgreSQL.

## Features

- **Authentication** - PassportJS with Local and JWT strategies
- **Role-Based Access Control (RBAC)** - Three role levels (USER, ADMIN, SUPER_ADMIN)
- **API Documentation** - Interactive Swagger/OpenAPI UI
- **Database** - Prisma ORM with PostgreSQL
- **Validation** - class-validator for DTO validation
- **Security** - Password hashing with bcrypt
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
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="1d"
PORT=3000
NODE_ENV="development"
```

### 4. Run Database Migration

```bash
npx prisma migrate dev
```

This will:
- Create the database tables
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

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/v1/auth/register` | Register a new user | No | - |
| POST | `/api/v1/auth/login` | Login with credentials | No | - |
| GET | `/api/v1/auth/profile` | Get current user profile | Yes | - |

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

### Usage Example

**Register as ADMIN:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "adminuser",
    "password": "SecurePass123!",
    "role": "ADMIN"
  }'
```

**Register regular USER (default):**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "regularuser",
    "password": "SecurePass123!"
  }'
```

**Login and Get Token:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "adminuser",
    "password": "SecurePass123!"
  }'
```

**Access Protected Route:**
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
src/
├── auth/                      # Authentication module
│   ├── dto/                   # DTOs (Login, Register)
│   ├── strategies/            # Passport strategies (Local, JWT)
│   ├── guards/                # Auth guards (JWT, Local, Roles)
│   ├── decorators/            # Custom decorators (@CurrentUser, @Roles)
│   ├── enums/                 # Role enum
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                     # Users module
│   ├── dto/                   # CreateUserDto
│   ├── entities/              # UserEntity
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── prisma/                    # Prisma module
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── config/                    # Configuration
│   └── configuration.ts
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

## Database Schema

```prisma
enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Testing with Swagger

1. Navigate to **http://localhost:3000/api**
2. Click **"Authorize"** button
3. Enter: `Bearer YOUR_JWT_TOKEN`
4. Try different endpoints and see role-based restrictions in action

**Testing Role Restrictions:**
- Try accessing `/users` with a USER role token - 403 Forbidden
- Try accessing `/users` with an ADMIN role token - Success
- Try deleting a user with ADMIN token - 403 Forbidden
- Try deleting a user with SUPER_ADMIN token - Success

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
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI
- **Password Hashing:** bcrypt
- **Package Manager:** pnpm

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_EXPIRATION` | Token expiration time | `1d`, `7d`, `24h` |
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment mode | `development`, `production` |

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication
- Role-based access control
- Input validation with class-validator
- CORS enabled
- DTO validation with whitelist
- Password exclusion from API responses

## Deployment

### Build for Production

```bash
pnpm run build
```

### Run Production Server

```bash
pnpm run start:prod
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production database
4. Enable HTTPS
5. Set up environment-specific configurations

## Roadmap

- Add refresh tokens
- Implement email verification
- Add password reset functionality
- Set up Redis for caching
- Add rate limiting
- Implement logging with Winston
- Add unit and E2E tests
- Set up Docker containerization
- Configure CI/CD pipeline
- Add more OAuth providers (Google, GitHub, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is MIT licensed.

## Author

**Sagar Karmoker**
- GitHub: [@SagarKarmoker](https://github.com/SagarKarmoker)
