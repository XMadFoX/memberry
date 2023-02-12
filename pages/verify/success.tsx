import { Box, Center } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../register/register.module.css';

const getTitle = (type: string): string => {
  switch (type) {
    case 'email':
      return 'Email confirmed';
    default:
      return 'Account confirmed';
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
          <p>You can close the tab or</p>
          <Link href="/">
            <a style={{ textDecoration: 'blue underline' }}>
              Return to home page
            </a>
          </Link>
        </div>
      </Box>
    </Center>
  );
}
