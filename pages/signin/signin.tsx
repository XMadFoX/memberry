import { TextInput, Button, Group, Box, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import 'dayjs/locale/ru';
import style from './signin.module.css';
import Link from 'next/link';

import { useMutation } from 'urql';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginMutation = `
  mutation ($email: String!, $password: String!) {
    login (email: $email, password: $password)
  }
`;
function Register() {
  const [loginResult, login] = useMutation(LoginMutation);
  const router = useRouter();

  const form = useForm<{
    email: string;
    password: string;
  }>({
    initialValues: {
      email: '',
      password: '',
    },

    validate: (values) => ({
      email: !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
        ? 'Неверная почта'
        : null,
      password:
        values.password.length < 8 || values.password.length > 32
          ? 'Пароль должен состоять из 8-32 символов'
          : null,
    }),
  });

  const handleSubmit = (values: typeof form.values) => {
    login(values);
  };

  useEffect(() => {
    if (loginResult?.data?.login === 'ok')
      setTimeout(() => router.push('/'), 5000);
  }, [loginResult, router]);

  return (
    <div className="container">
      <Center className={style.form_block}>
        <Box
          sx={{ maxWidth: 500, minWidth: 300 }}
          className={style.form_container}>
          {loginResult?.data?.login !== 'ok' ? (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <h1 className={style.title}>Вход</h1>
              <TextInput
                label="Почта"
                type="email"
                name="email"
                placeholder="your@email.com"
                disabled={loginResult.fetching}
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Пароль"
                type="password"
                name="password"
                placeholder="Qwerty1234."
                disabled={loginResult.fetching}
                {...form.getInputProps('password')}
              />
              {loginResult?.error && (
                <div>
                  {loginResult.error.graphQLErrors.map((err) => (
                    <p key={err.message}>{err.message}</p>
                  ))}
                </div>
              )}
              <Group position="center" mt="md">
                <Button type="submit" disabled={loginResult.fetching}>
                  Войти
                </Button>
              </Group>
              <nav className={style.navbar}>
                {/* <Link href="/signin/recovery">
                <a className={style.navbar__element}>Забыли пароль?</a>
              </Link> */}
                <Link href="/register">
                  <a className={style.navbar__element}>Зарегистрироваться</a>
                </Link>
              </nav>
            </form>
          ) : (
            <div
              style={{
                display: 'grid',
                alignItems: 'center',
                justifyItems: 'center',
              }}>
              <h1>Вход выполнен успешно!</h1>
              <p>
                Вы будете перенаправлены на{' '}
                <Link href="" replace>
                  <a>домашнюю страницу</a>
                </Link>{' '}
                в течении 5 секунд
              </p>
            </div>
          )}
        </Box>
      </Center>
    </div>
  );
}

export default Register;
