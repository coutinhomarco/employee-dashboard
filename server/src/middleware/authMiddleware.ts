import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth/authService';
import { UserPayload } from '../../types/express';

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    const user = await authService.verifyToken(token);
    if (user) {
      req.user = user as unknown as UserPayload;
      return next();
    } else {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

export { protect };
