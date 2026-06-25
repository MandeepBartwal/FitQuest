import { Router } from 'express';
import { register, login, me } from './auth.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, me);
