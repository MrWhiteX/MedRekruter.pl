import Head from 'next/head';
import { AppProps } from 'next/app';
import 'styles/globals.css';
import { Provider } from 'next-auth/client';

interface CustomPageProps extends AppProps {
  pageProps: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

function MyApp({ Component, pageProps }: CustomPageProps) {
  const metaTitle = pageProps.metaTitle;
  const metaDescription = pageProps.metaDescription;
  return (
    <Provider session={(pageProps as any).session}>
      <Head>
        <title>{metaTitle ? metaTitle : 'MedRekruter.pl - Portal z ogłoszeniami o pracę'}</title>

        <meta
          name="description"
          content={metaDescription ? metaDescription : 'Znajdź ofertę pracy związaną z medycyną'}
        />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
