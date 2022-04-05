import { Box, Center } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../register/register.module.css';

const getTitle = (type: string): string => {
  switch (type) {
    case 'email':
      return 'Почта подтверждена';
    default:
      return 'Аккаунт подтвержден';
  }
};

export default function Success() {
  const { query } = useRouter();

  return (
    <Center className={styles.form_block}>
      <Head>
        <title>{getTitle(query.type as string)}</title>
      </Head>
      <Box className={styles.form_container}>
        <div>
          <h1>{getTitle(query?.type as string)}</h1>
          <p>Вы можете закрыть эту вкладку или</p>
          <Link href="/">
            <a style={{ textDecoration: 'blue underline' }}>
              Вернуться на главную страницу
            </a>
          </Link>
        </div>
      </Box>
    </Center>
  );
}
