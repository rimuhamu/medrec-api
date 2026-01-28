import { user, patient, UserRole } from '@/db/schema';
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
      const [newPatient] = await tx
        .insert(patient)
        .values(patientData)
        .returning();
      console.log('PATIENT CREATED: ', newPatient);
      const [newUser] = await tx
        .insert(user)
        .values({
          username,
          password: hashedPassword,
          role: UserRole.USER,
          patientId: newPatient.id,
        })
        .returning({
          id: user.id,
          username: user.username,
          role: user.role,
          patientId: user.patientId,
        });
      console.log('USER CREATED: ', newUser);
      const token = this.generateToken({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      });

      return { user: newUser, token };
    });
  }

  async registerAdmin(
    username: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    const hashedPassword = await this.hashPassword(password);

    const [newUser] = await db
      .insert(user)
      .values({
        username,
        password: hashedPassword,
        role: UserRole.ADMIN,
      })
      .returning({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    console.log('ADMIN CREATED: ', newUser);

    const token = this.generateToken({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    return { user: newUser, token };
  }

  async login(
    username: string,
    password: string
  ): Promise<{ user: any; token: string } | null> {
    const foundUser = await db.query.user.findFirst({
      where: eq(user.username, username),
    });

    if (!foundUser) return null;

    const passwordValid = await this.verifyPassword(password, foundUser.password);

    if (!passwordValid) return null;

    const token = this.generateToken({
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    });

    const { password: _, ...userWithoutPassword } = foundUser;
    return { user: userWithoutPassword, token };
  }

  async getUserById(
    userInput: UserPayload | { userId: number } | number
  ): Promise<any | null> {
    let userId: number;

    // Fix the type checking logic
    if (typeof userInput === 'number') {
      userId = userInput;
    } else if (typeof userInput === 'object' && userInput !== null) {
      if ('id' in userInput) {
        userId = userInput.id;
      } else if ('userId' in userInput) {
        userId = userInput.userId;
      } else {
        console.error('Invalid user input format:', userInput);
        return null;
      }
    } else {
      console.error('Invalid user input type:', typeof userInput);
      return null;
    }

    if (!userId) {
      console.error('No user ID provided to getUserById');
      return null;
    }

    console.log(`Looking up user with ID: ${userId}`);

    const result = await db.query.user.findFirst({
      where: eq(user.id, userId),
      with: {
        patient: true,
      },
    });

    if (!result) return null;

    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }
}

//singleton export
export const authService = new AuthService();
