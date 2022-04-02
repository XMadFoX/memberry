import { TextInput, Button, Group, Box, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import 'dayjs/locale/ru';
import style from './recovery.module.css';
import Link from 'next/link';
import { useState } from 'react';

function Register() {
  const form = useForm<{
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    initialValues: { email: '', password: '', confirmPassword: '' },

    validate: (values) => ({
      email: !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
        ? 'Неверная почта'
        : null,
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
    }),
  });
  const [emailSent, setEmailSent] = useState(false);

  return (
    <div className="container">
      <Center className={style.form_block}>
        <Box
          sx={{ maxWidth: 400, minWidth: 300 }}
          className={style.form_container}>
          {!emailSent ? (
            <form onSubmit={() => setEmailSent(true)}>
              <h1 className={style.title}>Ввостановления аккаунта</h1>
              <TextInput
                label="Введите почту"
                placeholder="your@email.com"
                {...form.getInputProps('email')}
              />
              <Group position="center" mt="md">
                <Button
                  type="submit"
                  className={style.button_email}
                  id="button-email">
                  Подтвердить
                </Button>
              </Group>
              <nav className={style.navbar}>
                <Link href="/signin">
                  <a className={style.navbar__element}>Вернуться</a>
                </Link>
              </nav>
            </form>
          ) : (
            <>
            <img alt="" height={256} width={256} src='/illustrations/undraw_mail_sent_re_0ofv.svg'/>
              <h1>Письмо отправлено</h1>
              <h2>Письмо для восстановления пароля отправлено Вам на почту</h2>
            </>
          )}
        </Box>
      </Center>
    </div>
  );
}

export default Register;
