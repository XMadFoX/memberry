import styles from './register.module.css';
import { TextInput, Button, Group, Box, Center } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import 'dayjs/locale/ru';
import Link from 'next/link';

import { useMutation } from 'urql';
import { useState } from 'react';
import Image from 'next/image';

const RegisterMutation = `
  mutation ($username: String!, $email: String!, $password: String!, $birthday: Date!) {
    register (username: $username, email: $email, password: $password, birthday: $birthday)
  }
`;

export default function Register() {
  const [registerResult, register] = useMutation(RegisterMutation);
  const [birthday, setBirthday] = useState<Date | null>();

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
  };

  return (
    <div className="container">
      <Center className={styles.form_block}>
        <Box className={styles.form_container}>
          {registerResult?.data?.register === 'ok' && (
            <div
              style={{
                display: 'grid',
                alignItems: 'center',
                justifyItems: 'center',
              }}>
              <h1>Письмо отправлено</h1>
              <p>Проверьте почту для подтверждения регистрации</p>
              <small>Письмо действительно 5 минут.</small>
              <Image
                src="/ullustrations/undraw_mail_sent_re_0ofv.svg"
                alt=""
                height={256}
                width={256}
              />
            </div>
          )}
          {registerResult?.data?.register !== 'ok' && (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <h1 className={styles.title}>Регистрация</h1>
              <TextInput
                label="Почта"
                type="email"
                name="email"
                placeholder="your@email.com"
                disabled={registerResult.fetching}
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Имя пользователя"
                type="text"
                name="username"
                placeholder="Иван"
                disabled={registerResult.fetching}
                {...form.getInputProps('username')}
              />
              <DatePicker
                locale="ru"
                allowFreeInput
                value={birthday}
                name="dob"
                onChange={setBirthday}
                placeholder="Выберите дату"
                disabled={registerResult.fetching}
                label="Дата рождения"
              />
              <small style={{ opacity: 0.5 }}>
                Эта информация будет использована для адаптации сложности
              </small>
              <TextInput
                label="Пароль"
                name="password"
                type="password"
                placeholder="Qwerty1234"
                disabled={registerResult.fetching}
                {...form.getInputProps('password')}
              />
              <TextInput
                label="Подтвердите пароль"
                name="passwordConfirm"
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
