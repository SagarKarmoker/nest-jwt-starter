# NestJS Backend Starter - Quick Start Guide

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
pnpm install
```

### 2. Configure Environment Variables

Update the `.env` file with your PostgreSQL database connection:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="1d"
PORT=3000
NODE_ENV="development"
```

Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your actual PostgreSQL credentials.

### 3. Run Database Migration

After configuring your database URL, run:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database tables
- Generate the Prisma Client with TypeScript types

### 4. Start the Development Server

```bash
pnpm run start:dev
```

The application will start on `http://localhost:3000`

### 5. Access Swagger Documentation

Open your browser and navigate to:

```
http://localhost:3000/api
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login with username/password
- `GET /api/v1/auth/profile` - Get current user profile (requires JWT token)

### Users

- `GET /api/v1/users` - Get all users (requires JWT token)
- `GET /api/v1/users/:id` - Get user by ID (requires JWT token)

## Project Structure

```
src/
├── auth/                      # Authentication module
│   ├── dto/                   # Data transfer objects
│   ├── strategies/            # Passport strategies (Local, JWT)
│   ├── guards/                # Auth guards
│   ├── decorators/            # Custom decorators
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                     # Users module
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── prisma/                    # Prisma module
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── config/                    # Configuration
│   └── configuration.ts
├── app.module.ts
└── main.ts
```

## Testing the API

### Register a User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!@#"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!@#"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Features

✅ **Authentication** - PassportJS with Local and JWT strategies  
✅ **API Documentation** - Swagger/OpenAPI UI at `/api`  
✅ **Database** - Prisma ORM with PostgreSQL  
✅ **Validation** - class-validator for DTO validation  
✅ **Security** - Password hashing with bcrypt  
✅ **Type Safety** - Full TypeScript support  
✅ **Professional Structure** - Modular architecture following NestJS best practices

## Next Steps

1. Customize the User model in `prisma/schema.prisma`
2. Add more modules (e.g., products, orders, etc.)
3. Implement additional Passport strategies (OAuth, Google, GitHub, etc.)
4. Add role-based access control (RBAC)
5. Set up unit and e2e tests
6. Configure Docker for containerization
7. Set up CI/CD pipeline
