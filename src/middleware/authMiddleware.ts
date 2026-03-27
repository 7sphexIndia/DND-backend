import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { SafeAdmin } from '../models/adminModel.js';

interface AdminTokenPayload extends jwt.JwtPayload {
  admin: SafeAdmin;
}

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  const token = authHeader.slice('Bearer '.length);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({ error: 'Authentication is not configured' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AdminTokenPayload;
    req.admin = decoded.admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
