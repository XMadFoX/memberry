import User from '@models/User';
import { NextApiRequest } from 'next';
import { JwtPayload as _jwtPayload } from 'jsonwebtoken';

export interface req extends NextApiRequest {
  user?: typeof User;
}

export interface JwtPayload extends _jwtPayload {
  userId: string;
  password: string;
}
