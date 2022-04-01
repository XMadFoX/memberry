import { UserInputError } from 'apollo-server-micro';
import User from '../../../models/User';
import bcrypt from 'bcrypt';

interface args {
  username: string;
  email: string;
  password: string;
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
  if (
    (await User.findOne({ email: email })) !== null ||
    (await User.findOne({ username: username })) !== null
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
  await User.create({ username, email, password: passwordHash });
  return 'ok';
}
