import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticateToken } from '@/shared/middleware/auth';

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/refresh', authController.refreshToken);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authenticateToken, authController.me);

export { authRouter };