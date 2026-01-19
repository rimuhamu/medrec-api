# MedRec API

A medical records management API built with Hono, TypeScript, and SQLite. Features JWT authentication, role-based access control, and comprehensive patient data management.

## Features

- **Patient Management** - Full CRUD operations for patient records
- **Medical Records** - Medications, medical history, and diagnostic test results
- **Authentication** - JWT-based auth with admin/user roles
- **OpenAPI Docs** - Auto-generated interactive API documentation
- **Type-Safe** - Built with TypeScript, Zod validation, and Drizzle ORM

## Tech Stack

**Runtime:** Node.js + TypeScript  
**Framework:** Hono  
**Database:** SQLite (Turso/LibSQL)  
**ORM:** Drizzle ORM  
**Auth:** JWT + bcrypt  

## Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create `.env`:

```env
NODE_ENV=development
PORT=5000
LOG_LEVEL=info
DATABASE_URL=file:./dev.db
DATABASE_AUTH_TOKEN=
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
npm run db:seed      # Seed sample data
```

### Run Server

```bash
npm run dev  # Development mode
npm start    # Production mode
```

Access API at `http://localhost:5000`  
View docs at `http://localhost:5000/reference`

## Authentication

### Sample Credentials (after seeding)

**Admin:**
- Username: `admin`
- Password: `adminpassword123`

**Users:**
- Username: `johnsmith` / Password: `password123`
- Username: `sarahjohnson` / Password: `password123`

### Usage

1. **Login** to get JWT token:
```bash
POST /auth/login
{
  "username": "johnsmith",
  "password": "password123"
}
```

2. **Use token** in requests:
```bash
Authorization: Bearer <token>
```

## API Endpoints

### Public
- `GET /health` - Health check
- `POST /auth/register` - Register user with patient data
- `POST /auth/login` - User login

### Protected

**Auth:**
- `GET /auth/profile` - Get current user
- `POST /auth/register-admin` - Register admin (admin only)

**Patients (Admin only):**
- `GET /patients` - List all
- `POST /patients` - Create
- `GET /patients/:id` - Get one
- `PATCH /patients/:id` - Update
- `DELETE /patients/:id` - Delete

**Medications/Medical History/Test Results:**
- `GET /patients/:patientId/{resource}` - List
- `POST /patients/:patientId/{resource}` - Create
- `GET /patients/:patientId/{resource}/:id` - Get one
- `PATCH /patients/:patientId/{resource}/:id` - Update
- `DELETE /patients/:patientId/{resource}/:id` - Delete

*Users can only access their own patient records. Admins can access all.*

## Database Schema

**users** - id, username, password (hashed), role, patientId  
**patients** - id, name, age, address, phoneNumber, nextAppointment  
**medications** - id, name, dosage, frequency, duration, patientId  
**medical_history** - id, medicalConditions, allergies, surgeries, treatments, patientId  
**diagnostic_test_result** - id, title, result, patientId  

## Scripts

```bash
npm run dev          # Development server
npm run build        # Build TypeScript
npm start            # Production server
npm run lint         # Lint code
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database
```

## Project Structure

```
src/
├── db/              # Schema, migrations, database client
├── lib/             # App config, types, utilities
├── middlewares/     # Auth middleware
├── routes/          # API routes (auth, patients, medications, etc.)
├── scripts/         # Database seeding
├── services/        # Auth service
├── app.ts           # App configuration
└── server.ts        # Entry point
```
