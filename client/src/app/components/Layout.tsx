import { ReactNode } from 'react';
import { Box, Button, Flex, Heading, HStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAuth } from '../context/AuthContext';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <Box>
      <Flex as="header" bg="gray.800" p={4} color="white" justifyContent="space-between">
        <Heading size="md">Admin Dashboard</Heading>
        <HStack spacing={4}>
          <Link as={NextLink} href="/" color="white">Home</Link>
          <Link as={NextLink} href="/add-employee" color="white">Add Employee</Link>
          {!user.token ? (
            <>
              <Link as={NextLink} href="/login" color="white">Login</Link>
              <Link as={NextLink} href="/register" color="white">Register</Link>
            </>
          ) : (
            <Button onClick={logout} color="white">Logout</Button>
          )}
        </HStack>
      </Flex>
      <Box as="main" p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
