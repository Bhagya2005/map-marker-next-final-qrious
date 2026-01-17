import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
    email: string;
    username?: string;
  };
}

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getTokenFromRequest = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  return token;
};

export const authenticateRequest = (req: NextRequest) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return {
      authenticated: false,
      user: null,
      error: 'Access token required',
    };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      authenticated: false,
      user: null,
      error: 'Invalid token',
    };
  }

  return {
    authenticated: true,
    user: decoded,
    error: null,
  };
};
