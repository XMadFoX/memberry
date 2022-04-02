import { TextInput, Button, Group, Box, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import 'dayjs/locale/ru';
import style from './signin.module.css';
import Link from 'next/link'; 

function Register() {
  const form = useForm<{
    name: string;
    age: number | undefined;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    initialValues: {
      name: '',
      age: undefined,
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: (values) => ({
      name: 
            values.name.length < 2 || values.name.length > 16
              ? 'Имя пользователя должно состоять из 2-16 символов '
              : !/^[A-z0-9_]/.test(values.name) 
              ? 'Имя пользователя может содержать только буквы, цифры и символы подчеркивания'
              : null,


      email: !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email) ? 'Неверная почта' : null ,
      password: 
            values.password.length < 8 || values.password.length > 32
              ? 'Пароль должен состоять из 8-32 символов'
              : !/^[A-Za-z\d@$!%*?&#]$/.test(values.password) 
              ? 'Пароль должен содержать только буквы, цифры и специальные символы'
              : null,
      confirmPassword:
        values.confirmPassword != values.password
          ? 'Пароли не совпадает'
          : null,
      age: values.age === undefined ? 'Age is required' : null,
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
              placeholder="your@email.com"
              {...form.getInputProps('email')}
            />
            <TextInput
              label="Пароль"
              placeholder="Qwerty1234."
              {...form.getInputProps('password')}
            />
            <Group position="center" mt="md">
              <Button type="submit">Войти</Button>
            </Group>
            <nav className={style.navbar}>
              <Link href="/signin/recovery">
                <a className={style.navbar__element}>Забыли пароль?</a>
              </Link>
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
