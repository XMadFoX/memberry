import { TextInput, Button, Group, Box, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from 'urql';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './register.module.css';

const Birthday = dynamic(() => import('@components/auth/birthday'));
const EmailSent = dynamic(() => import('@components/auth/emailSent'));
const Link = dynamic(() => import('next/link'));

const RegisterMutation = `
  mutation ($username: String!, $email: String!, $password: String!, $birthday: Date!) {
    register (username: $username, email: $email, password: $password, birthday: $birthday)
  }
`;

export default function Register() {
  const [registerResult, register] = useMutation(RegisterMutation);
  const [birthday, setBirthday] = useState<Date | null>(null);

  const form = useForm<{
    username: string;
    birthday: Date | null;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    initialValues: {
      username: '',
      birthday: null,
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: (values) => ({
      username:
        values.username.length < 2 || values.username.length > 16
          ? 'Username must be between 2-16 characters '
          : !/^[A-z0-9_]/.test(values.username)
          ? 'Username can contain only letters, numbers and underscore'
          : null,

      email: !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
        ? 'Wrong email format'
        : null,
      password:
        values.password.length < 8 || values.password.length > 32
          ? 'Password must be between 8-32 characters'
          : !/^[A-Za-z\d@$!%*?&#]{8,32}$/.test(values.password)
          ? 'Password must contain only letters, numbers and special characters'
          : null,

      confirmPassword:
        values.confirmPassword != values.password
          ? "Passwords don't match"
          : null,
    }),
  });

  const handleSubmit = (values: typeof form.values) => {
    register({ ...values, birthday, confirmPassword: undefined });
    localStorage.setItem('birthday', JSON.stringify(birthday));
  };

  return (
    <div className="container">
      <Center className={styles.form_block}>
        <Box className={styles.form_container}>
          {registerResult?.data?.register === 'ok' && <EmailSent />}
          {registerResult?.data?.register !== 'ok' && (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <h1 className={styles.title}>Registration</h1>
              <TextInput
                label="Email"
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                disabled={registerResult.fetching}
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Username"
                type="text"
                name="username"
                required
                placeholder="Иван"
                disabled={registerResult.fetching}
                {...form.getInputProps('username')}
              />
              <Birthday
                fetching={registerResult.fetching}
                value={birthday}
                setValue={setBirthday}
              />
              <TextInput
                label="Password"
                name="password"
                required
                type="password"
                placeholder="Qwerty1234"
                disabled={registerResult.fetching}
                {...form.getInputProps('password')}
              />
              <TextInput
                label="Repeat password"
                name="passwordConfirm"
                required
                type="password"
                placeholder="Qwerty1234"
                disabled={registerResult.fetching}
                {...form.getInputProps('confirmPassword')}
              />
              <Group position="center" direction="column" spacing="xs" mt="md">
                <Button type="submit" disabled={registerResult.fetching}>
                  {registerResult.fetching ? 'Wait...' : 'Register'}
                </Button>
                <Link href="/signin">
                  <a className={styles.navbar__element}>Login</a>
                </Link>
              </Group>
            </form>
          )}
        </Box>
      </Center>
    </div>
  );
}
