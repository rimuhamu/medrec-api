import type { AppRouteHandler } from '@/lib/types';
import type {
  LoginRoute,
  ProfileRoute,
  RegisterAdminRoute,
  RegisterRoute,
} from './auth.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { authService } from '@/services/auth.service';

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  try {
    const { user: userData, patient: patientData } = await c.req.json();

    // Check if username already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, userData.username),
    });

    if (existingUser) {
      return c.json(
        { message: 'Username already exists' },
        HttpStatusCodes.CONFLICT
      );
    }

    // Register the user
    const result = await authService.registerUser(
      userData.username,
      userData.password,
      patientData
    );

    return c.json(result, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error('User registration error:', error);
    return c.json(
      { message: 'Failed to register user' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const registerAdmin: AppRouteHandler<RegisterAdminRoute> = async (c) => {
  try {
    const userData = await c.req.json();

    // Check if username already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, userData.username),
    });

    if (existingUser) {
      return c.json(
        { message: 'Username already exists' },
        HttpStatusCodes.CONFLICT
      );
    }

    // Register the admin
    const result = await authService.registerAdmin(
      userData.username,
      userData.password
    );

    return c.json(result, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error('Admin registration error:', error);
    return c.json(
      { message: 'Failed to register admin' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  try {
    const { username, password } = await c.req.json();

    // Attempt login
    const result = await authService.login(username, password);

    if (!result) {
      return c.json(
        { message: 'Invalid username or password' },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    return c.json(result, HttpStatusCodes.OK);
  } catch (error) {
    console.error('Login error:', error);
    return c.json(
      { message: 'Failed to login' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const profile: AppRouteHandler<ProfileRoute> = async (c) => {
  try {
    const user = c.get('user');

    if (!user) {
      return c.json(
        { message: 'Not authenticated' },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    const userData = await authService.getUserById(user.userId);

    if (!userData) {
      return c.json({ message: 'User not found' }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(userData, HttpStatusCodes.OK);
  } catch (error) {
    console.error('Get current user error:', error);
    return c.json(
      { message: 'Failed to get user data' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
