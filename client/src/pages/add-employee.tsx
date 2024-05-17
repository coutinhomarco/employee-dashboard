import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, useToast, Spinner, Text } from '@chakra-ui/react';
import Layout from '../app/components/Layout';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('HR');
  const [dateOfHire, setDateOfHire] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, position, department, dateOfHire }),
      });
      if (!response.ok) {
        throw new Error('Failed to initiate employee addition.');
      }
      const data = await response.json();
      pollJobStatus(data.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add employee. Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      console.error(error);
      setLoading(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const interval = setInterval(async () => {
        const response = await fetch(`${apiUrl}/api/job/${jobId}/status`);
        const data = await response.json();
        
        if (data.state === 'completed') {
          clearInterval(interval);
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
          setDateOfHire('');
          setLoading(false);
        } else if (data.state === 'failed') {
          clearInterval(interval);
          setError(data.failedReason);
          setLoading(false);
        }
      }, 800); // Poll every 0.8 seconds
    } catch (error) {
      setError('Error fetching job status.');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {loading && <Spinner size="xl" />}
      <Box as="form" onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={e => setName(e.target.value)} bg="gray.700" color="white" />
        </FormControl>
        <FormControl id="position" mb={4} isRequired>
          <FormLabel>Position</FormLabel>
          <Input value={position} onChange={e => setPosition(e.target.value)} bg="gray.700" color="white" />
        </FormControl>
        <FormControl id="department" mb={4} isRequired>
          <FormLabel>Department</FormLabel>
          <Select defaultValue={"HR"} value={department} onChange={e => setDepartment(e.target.value)} bg="gray.700" color="white">
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Director">Director</option>
          </Select>
        </FormControl>
        <FormControl id="dateOfHire" mb={4} isRequired>
          <FormLabel>Date of Hire</FormLabel>
          <Input type="date" value={dateOfHire} onChange={e => setDateOfHire(e.target.value)} bg="gray.700" color="white" />
        </FormControl>
        <Button type="submit" colorScheme="teal">
          Add Employee
        </Button>
      </Box>
    </Layout>
  );
};

export default AddEmployee;
