import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthUser {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const JWT_SECRET = process.env.JWT_SECRET || ''

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // verifica e decodifica o token com a liv JWT
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & AuthUser;

    // guarda os dados do usuário na requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin only' });
  }

  return next();
}