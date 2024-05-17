import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import customTheme from '../app/theme';
import { AuthProvider } from '../app/context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
