import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    },
  },
  components: {
    Table: {
      variants: {
        simple: {
          th: {
            color: 'white',
            bg: 'gray.800',
          },
          td: {
            color: 'white',
            bg: 'gray.700',
          },
        },
      },
    },
  },
});

export default customTheme;
