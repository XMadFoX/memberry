import { req } from '@lib/types';
import dbConnect from '@lib/dbConnect';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiResponse } from 'next';
import User from '@models/User';
import { serialize } from 'cookie';

interface JwtPayloadVerify extends JwtPayload {
  userId: string;
  email: string;
}

console.log('Init /api/verify');
dbConnect();

export default async function handler(req: req, res: NextApiResponse) {
  const token: string = req.query.t as string;
  try {
    const payload: JwtPayloadVerify = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayloadVerify;
    const user = await User.findOne({
      _id: payload.userId,
      email: payload.email,
    });
    // if already confirmed redirect to home page
    if (user.confirmed)
      res.status(200).redirect(process.env.NEXT_PUBLIC_FRONT_END!);
    // check is token expired
    const expired = new Date(user.expiresAt) < new Date();
    if (expired) {
      res.status(401).send('Token expired');
      return;
    }
    // if everything is ok, confirm user
    User.findOneAndUpdate({ _id: user._id }, { $set: { confirmed: true } });
    // generate auth token
    const authToken = jwt.sign(
      { userId: user.id, password: user.password },
      process.env.JWT_SECRET!,
      {
        expiresIn: '90d',
      }
    );
    // save with cookie
    const cookie = serialize('token', authToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 90,
    });
    // send cookie with response
    res.setHeader('Set-Cookie', cookie);
    console.log('User confirmed', user);
    res
      .status(200)
      .redirect(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL!}/verify/success?type=email`
      );
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
}
