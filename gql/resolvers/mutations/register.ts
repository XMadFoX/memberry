import { UserInputError } from 'apollo-server-micro';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import createEmailBody from '@lib/email/verification';

interface args {
  username: string;
  email: string;
  password: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'no-reply@laserflare.net', // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
});

function calcExpiration(): Date {
  const now = new Date();
  return new Date(now.setMinutes(now.getMinutes() + 5));
}

export default async function registerMutation(
  parent: any,
  args: args,
  context: any
) {
  const { username, email, password } = args;
  // verify username using regex
  if (!/^[A-z0-9_]{2,16}$/)
    throw new UserInputError(
      'Username must be 2-16 characters long and can only contain letters, numbers and underscores'
    );
  // check email using regex
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    throw new UserInputError('Invalid email address');
  // check is user already exists in DB
  const foundUser = await User.findOne({ email: email });
  if (
    (foundUser !== null ||
      (await User.findOne({ username: username })) !== null) &&
    foundUser.confirmed == true
  )
    throw new UserInputError('User already registered');
  // check password using regex: length 8-32, allow letters, numbers and special characters
  if (!/^[A-Za-z\d@$!%*?&#]{8,32}$/.test(password))
    throw new UserInputError(
      'Password must be 8-32 characters long and can only contain letters, numbers and special characters'
    );
  // hash password
  const passwordHash = await bcrypt.hash(password, 10);
  // save user in DB
  const userData = {
    username,
    email,
    password: passwordHash,
    expiresAt: calcExpiration(),
  };
  const res = foundUser
    ? await User.updateOne({ email }, userData)
    : await User.create(userData);
  // sign jwt token with res._id & res.email
  const token = jwt.sign(
    foundUser
      ? { userId: foundUser._id, email: foundUser.email }
      : { userId: res._id, email: res.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: 60 * 5, // expire in 5 minutes
    }
  );
  const sentEmail = await transporter.sendMail({
    from: '"NoReply" <no-reply@laserflare.net>', // sender address
    to: args.email, // list of receivers
    subject: 'Добро пожаловать в MemBerry!', // Subject line
    text: 'Спасибо за регистрацию в MemBerry! Вам нужно подтвердить регистрацию по ссылке в письме.', // plain text body
    html: createEmailBody(token), // html body
  });
  return 'ok';
}
