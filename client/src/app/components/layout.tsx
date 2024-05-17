import { ReactNode } from 'react';
import { Box, Flex, Heading, HStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <Box>
    <Flex as="header" bg="teal.500" p={4} color="white" justifyContent="space-between">
      <Heading size="md">Admin Dashboard</Heading>
      <HStack spacing={4}>
        <Link as={NextLink} href="/">Home</Link>
        <Link as={NextLink} href="/add-employee">Add Employee</Link>
      </HStack>
    </Flex>
    <Box as="main" p={4}>
      {children}
    </Box>
  </Box>
);

export default Layout;
