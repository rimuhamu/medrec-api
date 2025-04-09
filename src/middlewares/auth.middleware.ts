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

  console.log('User set in context:', c.get('user'));

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
  console.log('User from context in userResourceAccess:', user);
  console.log('All parameters:', c.req.param());

  const requestedPatientId = parseInt(c.req.param('patientId'));
  console.log('Requested patient ID:', requestedPatientId);

  if (user.role === 'admin') {
    return next();
  }

  const userData = await authService.getUserById(user.id);
  console.log(userData);

  if (!userData || userData.patientId !== requestedPatientId) {
    return c.json(
      { message: 'Forbidden: You can only access your own records' },
      HttpStatusCodes.FORBIDDEN
    );
  }

  return next();
};
