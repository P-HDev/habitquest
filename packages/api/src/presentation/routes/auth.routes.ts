import { Router, Request, Response } from 'express';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { RegisterUser } from '../../application/use-cases/register-user.js';
import { LoginUser, RefreshToken } from '../../application/use-cases/login-user.js';
import { GoogleAuth } from '../../application/use-cases/google-auth.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';

export function createAuthRouter(userRepo?: IUserRepository): Router {
  const router = Router();

  // Lazy init for when no DI provided
  let _userRepo: IUserRepository;
  function getUserRepo(): IUserRepository {
    if (userRepo) return userRepo;
    if (!_userRepo) {
      const { getDatabase } = require('../../infrastructure/database/connection.js');
      const { SQLiteUserRepository } = require('../../infrastructure/repositories/sqlite-user.repository.js');
      _userRepo = new SQLiteUserRepository(getDatabase());
    }
    return _userRepo;
  }

  router.post('/register', (req: Request, res: Response) => {
    try {
      const { email, name, password } = req.body;
      if (!email || !name || !password) {
        res.status(400).json({ error: 'Email, nome e senha são obrigatórios' });
        return;
      }

      const useCase = new RegisterUser(getUserRepo());
      const user = useCase.execute({ email, name, password });

      const loginUseCase = new LoginUser(getUserRepo());
      const tokens = loginUseCase.execute({ email, password });

      res.status(201).json(tokens);
    } catch (err: any) {
      if (err.message === 'EMAIL_EXISTS') {
        res.status(409).json({ error: 'Email já cadastrado' });
        return;
      }
      if (err.message === 'PASSWORD_TOO_SHORT') {
        res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        return;
      }
      res.status(500).json({ error: 'Erro interno' });
    }
  });

  router.post('/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
        return;
      }

      const useCase = new LoginUser(getUserRepo());
      const tokens = useCase.execute({ email, password });
      res.json(tokens);
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({ error: 'Email ou senha inválidos' });
        return;
      }
      res.status(500).json({ error: 'Erro interno' });
    }
  });

  router.post('/refresh', (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token obrigatório' });
        return;
      }

      const useCase = new RefreshToken(getUserRepo());
      const tokens = useCase.execute(refreshToken);
      res.json(tokens);
    } catch (err: any) {
      if (err.message === 'INVALID_TOKEN') {
        res.status(401).json({ error: 'Refresh token inválido' });
        return;
      }
      res.status(500).json({ error: 'Erro interno' });
    }
  });

  router.post('/google', async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        res.status(400).json({ error: 'Google ID token obrigatório' });
        return;
      }

      const useCase = new GoogleAuth(getUserRepo());
      const result = await useCase.execute(idToken);
      res.json(result);
    } catch (err: any) {
      if (err.message === 'INVALID_GOOGLE_TOKEN') {
        res.status(401).json({ error: 'Token do Google inválido' });
        return;
      }
      res.status(500).json({ error: 'Erro interno' });
    }
  });

  router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
    const repo = getUserRepo();
    const user = repo.findById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    res.json({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl });
  });

  return router;
}
