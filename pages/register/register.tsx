import { TextInput, Button, Group, Box, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import 'dayjs/locale/ru';
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
          ? 'Имя пользователя должно состоять из 2-16 символов '
          : !/^[A-z0-9_]/.test(values.username)
          ? 'Имя пользователя может содержать только буквы, цифры и нижнюю черту'
          : null,

      email: !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
        ? 'Неверная почта'
        : null,
      password:
        values.password.length < 8 || values.password.length > 32
          ? 'Пароль должен состоять из 8-32 символов'
          : !/^[A-Za-z\d@$!%*?&#]{8,32}$/.test(values.password)
          ? 'Пароль должен содержать только буквы, цифры и специальные символы'
          : null,

      confirmPassword:
        values.confirmPassword != values.password
          ? 'Пароли не совпадает'
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
              <h1 className={styles.title}>Регистрация</h1>
              <TextInput
                label="Почта"
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                disabled={registerResult.fetching}
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Имя пользователя"
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
                label="Пароль"
                name="password"
                required
                type="password"
                placeholder="Qwerty1234"
                disabled={registerResult.fetching}
                {...form.getInputProps('password')}
              />
              <TextInput
                label="Подтвердите пароль"
                name="passwordConfirm"
                required
                type="password"
                placeholder="Qwerty1234"
                disabled={registerResult.fetching}
                {...form.getInputProps('confirmPassword')}
              />
              <Group position="center" direction="column" spacing="xs" mt="md">
                <Button type="submit" disabled={registerResult.fetching}>
                  {registerResult.fetching
                    ? 'Подождите...'
                    : 'Зарегистрироваться'}
                </Button>
                <Link href="/signin">
                  <a className={styles.navbar__element}>Вернуться</a>
                </Link>
              </Group>
            </form>
          )}
        </Box>
      </Center>
    </div>
  );
}
