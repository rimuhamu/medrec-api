import { authService } from '@/services/auth.service';
import type { Context, Next } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export const authenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  console.log('Authenticating...');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      { message: 'Unauthorized: No token provided' },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const token = authHeader.split(' ')[1];

  const payload = authService.verifyToken(token);

  console.log('TOKEN:', token);
  console.log('PAYLOAD:', payload);
  if (!payload) {
    return c.json(
      { message: 'Unauthorized: Invalid token' },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  c.set('user', payload);

  return next();
};

export const adminOnly = async (c: Context, next: Next) => {
  const user = c.get('user');

  if (!user || user.role !== 'admin') {
    return c.json(
      { message: 'Forbidden: Admin access required' },
      HttpStatusCodes.FORBIDDEN
    );
  }

  return next();
};

export const userResourceAccess = async (c: Context, next: Next) => {
  const user = c.get('user');
  const requestedPatientId = parseInt(c.req.param('id'));

  console.log('user resource access check...');
  if (user.role === 'admin') {
    return next();
  }
  console.log(requestedPatientId);
  const userData = await authService.getUserById(user.userId);
  console.log(userData);

  if (!userData || userData.patientId !== requestedPatientId) {
    return c.json(
      { message: 'Forbidden: You can only access your own records' },
      HttpStatusCodes.FORBIDDEN
    );
  }

  return next();
};
