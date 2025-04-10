import { users, patients, UserRole } from '@/db/schema';
import db from '@/db';
import { genSalt, hash, compare } from 'bcrypt-ts';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import env from '@/env';

export interface UserPayload {
  id: number;
  username: string;
  role: string;
}

export class AuthService {
  private readonly JWT_SECRET = env.JWT_SECRET || 'super-secret-jwt-token';
  private readonly SALT_ROUNDS = 10;
  private readonly TOKEN_EXPIRY = '8h';
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.SALT_ROUNDS);
    return hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  generateToken(payload: UserPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.TOKEN_EXPIRY });
  }

  verifyToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as UserPayload;
    } catch (error) {
      return null;
    }
  }

  async registerUser(
    username: string,
    password: string,
    patientData: any
  ): Promise<{ user: any; token: string }> {
    const hashedPassword = await this.hashPassword(password);
    return await db.transaction(async (tx) => {
      const [patient] = await tx
        .insert(patients)
        .values(patientData)
        .returning();
      console.log('PATIENT CREATED: ', patient);
      const [user] = await tx
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          role: UserRole.USER,
          patientId: patient.id,
        })
        .returning({
          id: users.id,
          username: users.username,
          role: users.role,
          patientId: users.patientId,
        });
      console.log('USER CREATED: ', user);
      const token = this.generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      return { user, token };
    });
  }

  async registerAdmin(
    username: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    const hashedPassword = await this.hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        role: UserRole.ADMIN,
      })
      .returning({
        id: users.id,
        username: users.username,
        role: users.role,
      });
    console.log('ADMIN CREATED: ', user);

    const token = this.generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return { user, token };
  }

  async login(
    username: string,
    password: string
  ): Promise<{ user: any; token: string } | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) return null;

    const passwordValid = await this.verifyPassword(password, user.password);

    if (!passwordValid) return null;

    const token = this.generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(
    user: UserPayload | { userId: number }
  ): Promise<any | null> {
    const userId = 'id' in user ? user.id : user.userId;

    if (!userId) {
      console.error('No user ID provided to getUserById');
      return null;
    }
    console.log(`Looking up user with ID: ${userId}`);

    const foundUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        patient: true,
      },
    });

    if (!foundUser) return null;

    const { password, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
  }
}

//singleton export
export const authService = new AuthService();
