import { useState } from 'react';
import { useAuth } from '../app/context/AuthContext';
import { Box, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import Layout from '../app/components/Layout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register. Please try again.',
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
        <Button type="submit" colorScheme="teal">Register</Button>
      </Box>
    </Layout>
  );
};

export default Register;
