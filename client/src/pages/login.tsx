import { useState } from 'react';
import { useAuth } from '../app/context/AuthContext';
import { Box, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import Layout from '../app/components/Layout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to login. Please try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <Box as="form" onSubmit={handleSubmit}>
        <FormControl id="username" mb={4} isRequired>
          <FormLabel>Username</FormLabel>
          <Input value={username} onChange={e => setUsername(e.target.value)} />
        </FormControl>
        <FormControl id="password" mb={4} isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </FormControl>
        <Button type="submit" colorScheme="teal">Login</Button>
      </Box>
    </Layout>
  );
};

export default Login;
