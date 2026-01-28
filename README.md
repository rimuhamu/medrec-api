# MedRec API

A medical records management API built with Hono, TypeScript, and SQLite. Features JWT authentication, role-based access control, comprehensive patient data management, and AI-powered medical insights.

## Features

- **Patient Management** - Full CRUD operations for patient records
- **Medical Records** - Medications, medical history, and diagnostic test results
- **Authentication** - JWT-based auth with admin/user roles
- **OpenAPI Docs** - Auto-generated interactive API documentation
- **Type-Safe** - Built with TypeScript, Zod validation, and Drizzle ORM
- **AI-Powered Insights** - Google Gemini integration for medication scheduling and test result explanations

## Tech Stack

**Runtime:** Node.js + TypeScript  
**Framework:** Hono  
**Database:** SQLite (Turso/LibSQL)  
**ORM:** Drizzle ORM  
**Auth:** JWT + bcrypt  
**AI:** Google Gemini API  

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
LLM_API_KEY=your-google-gemini-api-key
```

> **Note:** `LLM_API_KEY` is optional but required for AI-powered features (medication scheduling, test result explanations).

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

**Medications:**
- `GET /patients/:patientId/medications` - List
- `POST /patients/:patientId/medications` - Create
- `GET /patients/:patientId/medications/:id` - Get one
- `PATCH /patients/:patientId/medications/:id` - Update
- `DELETE /patients/:patientId/medications/:id` - Delete
- `GET /patients/:patientId/medications/schedule` - **AI-generated daily schedule**

**Diagnostic Test Results:**
- `GET /patients/:patientId/diagnostic-test-results` - List
- `POST /patients/:patientId/diagnostic-test-results` - Create
- `GET /patients/:patientId/diagnostic-test-results/:id` - Get one
- `PATCH /patients/:patientId/diagnostic-test-results/:id` - Update
- `DELETE /patients/:patientId/diagnostic-test-results/:id` - Delete
- `GET /patients/:patientId/diagnostic-test-results/:id/explain` - **AI-generated ELI5 explanation**

**Medical History:**
- `GET /patients/:patientId/medical-history` - List
- `POST /patients/:patientId/medical-history` - Create
- `GET /patients/:patientId/medical-history/:id` - Get one
- `PATCH /patients/:patientId/medical-history/:id` - Update
- `DELETE /patients/:patientId/medical-history/:id` - Delete

*Users can only access their own patient records. Admins can access all.*

## AI-Powered Features

### Medication Schedule Generation
Generate an AI-powered daily medication schedule based on a patient's medications:
```bash
GET /patients/:patientId/medications/schedule
```

Returns a structured schedule organizing medications by time of day (Morning, Afternoon, Evening, etc.).

### Diagnostic Test Result Explanation
Get an ELI5 (Explain Like I'm 5) explanation of medical test results in plain, patient-friendly language:
```bash
GET /patients/:patientId/diagnostic-test-results/:id/explain
```

Returns the original result alongside a simplified explanation that avoids medical jargon.

## Database Schema

**users** - id, username, password (hashed), role, patientId, createdAt, updatedAt  
**patients** - id, name, age, address, phoneNumber, nextAppointment, createdAt, updatedAt  
**medications** - id, name, dosage, frequency, duration, patientId, createdAt, updatedAt  
**medical_histories** - id, medicalConditions, allergies (JSON array), surgeries, treatments, patientId, createdAt, updatedAt  
**diagnostic_test_results** - id, title, result, patientId, createdAt, updatedAt  

## Scripts

```bash
npm run dev          # Development server
npm run build        # Build TypeScript
npm start            # Production server
npm run lint         # Lint code
npm run lint:fix     # Lint and fix code
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
│   ├── auth/
│   ├── diagnostic-test-results/
│   ├── medical-history/
│   ├── medications/
│   └── patients/
├── scripts/         # Database seeding
├── services/        # Auth service, LLM service
├── app.ts           # App configuration
├── env.ts           # Environment configuration
└── server.ts        # Entry point
```

## Deployment

This API is configured for deployment on Vercel. See `vercel.json` for configuration.

## License

MIT
