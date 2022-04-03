import { TextInput, Button, Group, Box, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import 'dayjs/locale/ru';
import style from './signin.module.css';
import Link from 'next/link';

function Register() {
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
  return (
    <div className="container">
      <Center className={style.form_block}>
        <Box
          sx={{ maxWidth: 500, minWidth: 300 }}
          className={style.form_container}>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <h1 className={style.title}>Вход</h1>
            <TextInput
              label="Почта"
              type="email"
              name="email"
              placeholder="your@email.com"
              {...form.getInputProps('email')}
            />
            <TextInput
              label="Пароль"
              type="password"
              name="password"
              placeholder="Qwerty1234."
              {...form.getInputProps('password')}
            />
            <Group position="center" mt="md">
              <Button type="submit">Войти</Button>
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
        </Box>
      </Center>
    </div>
  );
}

export default Register;
