import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../infra/db/prisma.js';
import { env } from '../../config/env.js';
import type { RegisterInput, LoginInput, JwtPayload } from './auth.types.js';

const SALT_ROUNDS = 10;

function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email: input.email, password: hashedPassword },
    select: { id: true, email: true, createdAt: true },
  });

  const token = signToken({ userId: user.id, email: user.email });
  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  const token = signToken({ userId: user.id, email: user.email });
  return { user: { id: user.id, email: user.email }, token };
}
