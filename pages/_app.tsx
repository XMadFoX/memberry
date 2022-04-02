import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createClient, Provider as UrqlProvider } from '@urql/preact';

const client = createClient({
  url: 'http://localhost:3000/api/gql',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UrqlProvider value={client}>
      <Component {...pageProps} />
    </UrqlProvider>
  );
}

export default MyApp;
