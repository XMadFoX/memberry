import styles from './register.module.css';
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  NumberInput,
  Center,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import 'dayjs/locale/ru';
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
      <Center className={styles.form_block}>
        <Box className={styles.form_container}>
          <h1 className={styles.title}>Регистрация</h1>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput
              label="Почта"
              placeholder="your@email.com"
              {...form.getInputProps('email')}
            />
            <TextInput
              label="Имя пользователя"
              placeholder="Иван"
              {...form.getInputProps('name')}
            />
            <DatePicker
              locale="ru"
              placeholder="Выберите дату"
              label="Дата рождения"
            />
            <TextInput
              label="Пароль"
              placeholder="Qwerty1234."
              {...form.getInputProps('password')}
            />
            <TextInput
              label="Подтвердите пароль"
              placeholder="Qwerty1234."
              {...form.getInputProps('confirmPassword')}
            />

            <Group position="center" direction="column" spacing="xs" mt="md">
              <Button type="submit">Зарегистрироваться</Button>
              <Link href="/signin">
                <a className={styles.navbar__element}>Вернуться</a>
              </Link>
            </Group>
          </form>
        </Box>
      </Center>
    </div>
  );
}

export default Register;
