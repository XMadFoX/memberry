import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createClient, Provider as UrqlProvider } from 'urql';
import Head from 'next/head';

const client = createClient({
  url: process.env.NEXT_PUBLIC_FRONTEND_URL + '/api/gql',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UrqlProvider value={client}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <title>Memberry</title>
      </Head>
      <Component {...pageProps} />
    </UrqlProvider>
  );
}

export default MyApp;
