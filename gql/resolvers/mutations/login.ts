import { UserInputError } from 'apollo-server-micro';
import { NextApiResponse } from 'next';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '@models/User';
import { req } from '@lib/types';

interface args {
  email: string;
  password: string;
}

export default async function loginMutation(
  parent: any,
  args: args,
  { req, res }: { req: req; res: NextApiResponse }
) {
  const { email, password } = args;
  // if already authorized
  if (req.user) throw new UserInputError('Вы уже авторизованы');
  // check email using regex
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    throw new UserInputError('Invalid email address');
  // check password length
  if (password.length > 32) throw new UserInputError('Password too long');
  // try to find user in DB
  const user = await User.findOne({ email });
  if (!user)
    throw new UserInputError(
      'Пользователь не найден. Воспользуйтесь формой регистрации'
    );
  if (!user.confirmed)
    throw new UserInputError(
      'Вы еще не подтвердили почту. Если ссылка для подтверждения истекла, используйте форму для регистрации снова.'
    );
  // check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UserInputError('Неверный пароль');
  // generate JWT token
  const token = jwt.sign(
    { userId: user.id, password: user.password },
    process.env.JWT_SECRET!,
    {
      expiresIn: '90d',
    }
  );
  // create cookie
  const cookie = serialize('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });
  // send cookie with response
  res.setHeader('Set-Cookie', cookie);
  return 'ok';
}
