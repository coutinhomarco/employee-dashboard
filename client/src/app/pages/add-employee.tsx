import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, useToast } from '@chakra-ui/react';
import axios from 'axios';
import Layout from '../components/layout';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('/api/employees', { name, position, department, dateOfJoining }).then(() => {
      toast({
        title: 'Employee added.',
        description: "We've added the employee for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      setName('');
      setPosition('');
      setDepartment('');
      setDateOfJoining('');
    });
  };

  return (
    <Layout>
      <Box as="form" onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </FormControl>
        <FormControl id="position" mb={4} isRequired>
          <FormLabel>Position</FormLabel>
          <Input value={position} onChange={e => setPosition(e.target.value)} />
        </FormControl>
        <FormControl id="department" mb={4} isRequired>
          <FormLabel>Department</FormLabel>
          <Select value={department} onChange={e => setDepartment(e.target.value)}>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </Select>
        </FormControl>
        <FormControl id="dateOfJoining" mb={4} isRequired>
          <FormLabel>Date of Joining</FormLabel>
          <Input type="date" value={dateOfJoining} onChange={e => setDateOfJoining(e.target.value)} />
        </FormControl>
        <Button type="submit" colorScheme="teal">
          Add Employee
        </Button>
      </Box>
    </Layout>
  );
};

export default AddEmployee;
