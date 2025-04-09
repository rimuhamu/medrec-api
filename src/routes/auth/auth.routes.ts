import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { insertPatientsSchema, loginSchema } from '@/db/schema';

const tags = ['Authentication'];

export const register = createRoute({
  path: '/auth/register',
  method: 'post',
  tags,
  request: {
    body: jsonContentRequired(
      z.object({
        user: loginSchema,
        patient: insertPatientsSchema,
      }),
      'Registration data with user credentials and patient information'
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        user: z.object({
          id: z.number(),
          username: z.string(),
          role: z.string(),
          patientId: z.number(),
        }),
        token: z.string(),
      }),
      'Registration successful'
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({ message: z.string() }),
      'Username already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ message: z.string() }),
      'Validation error'
    ),
  },
});

export const registerAdmin = createRoute({
  path: '/auth/register-admin',
  method: 'post',
  tags,
  request: {
    body: jsonContentRequired(loginSchema, 'Admin credentials'),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        user: z.object({
          id: z.number(),
          username: z.string(),
          role: z.string(),
        }),
        token: z.string(),
      }),
      'Admin registration successful'
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({ message: z.string() }),
      'Username already exists'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginSchema),
      'Validation error'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ message: z.string() }),
      'Validation error'
    ),
  },
});

export const login = createRoute({
  path: '/auth/login',
  method: 'post',
  tags,
  request: {
    body: jsonContentRequired(loginSchema, 'User credentials'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        user: z.object({
          id: z.number(),
          username: z.string(),
          role: z.string(),
          patientId: z.number().optional(),
        }),
        token: z.string(),
      }),
      'Login successful'
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      'Invalid credentials'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginSchema),
      'Validation error'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ message: z.string() }),
      'Validation error'
    ),
  },
});

export const profile = createRoute({
  path: '/auth/profile',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.number(),
        username: z.string(),
        role: z.string(),
        patientId: z.number().optional(),
        patient: z.object({}).optional(),
      }),
      'Current user data'
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      'Not authenticated'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      'User not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ message: z.string() }),
      'Validation error'
    ),
  },
});

export type RegisterRoute = typeof register;
export type RegisterAdminRoute = typeof registerAdmin;
export type LoginRoute = typeof login;
export type ProfileRoute = typeof profile;
