import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormControl, FormLabel, Input, Select, useToast, Spinner, Text } from '@chakra-ui/react';
import Layout from '../app/components/Layout';
import ProtectedRoute from '../../src/app/components/ProtectedRoute';


type Employee = {
  _id: string;
  name: string;
  position: string;
  department: string;
  dateOfHire: string;
};

const EditEmployee = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [dateOfHire, setDateOfHire] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const reqHeaders = {
          "method": "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }          
        }
        const response = await fetch(`${apiUrl}/api/employees/${id}`, reqHeaders);
        if (!response.ok) {
          throw new Error('Failed to fetch employee details.');
        }
        const data = await response.json();
        if (data.message === 'Employee retrieval in progress') {
          pollJobStatus(data.data);
        } else {
          setEmployeeData(data);
        }
      } catch (error) {
        setError('Failed to load employee details.');
        console.error('Error fetching employee details:', error);
        setLoading(false);
      }
    };

    const pollJobStatus = async (jobId: string) => {
      const interval = setInterval(async () => {
        try {
          const reqHeaders = {
            "method": "GET",
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
          const response = await fetch(`${apiUrl}/api/job/${jobId}/status`, reqHeaders);
          const data = await response.json();
          if (data.state === 'completed') {
            clearInterval(interval);
            setEmployeeData(data.result);
            setLoading(false);
          } else if (data.state === 'failed') {
            clearInterval(interval);
            setError(data.failedReason);
            setLoading(false);
          }
        } catch (error) {
          clearInterval(interval);
          setError('Error fetching job status.');
          console.error(error);
          setLoading(false);
        }
      }, 500);
    };

    const setEmployeeData = (data: Employee) => {
      setEmployee(data);
      setName(data.name);
      setPosition(data.position);
      setDepartment(data.department);
      const formattedDate = new Date(data.dateOfHire).toISOString().split('T')[0];
      setDateOfHire(formattedDate);
    };

    if (id) {
      fetchEmployee();
    }
  }, [id, apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!id) return;
      const response = await fetch(`${apiUrl}/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, position, department, dateOfHire }),
      });
      if (!response.ok) {
        throw new Error('Failed to update employee.');
      }
      toast({
        title: 'Employee updated.',
        description: "Employee details have been successfully updated.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      router.push('/');
    } catch (error) {
      setError('Failed to update employee.');
      console.error('Error updating employee:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Spinner size="xl" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Text color="red.500">{error}</Text>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
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
            <Select value={department} onChange={e => setDepartment(e.target.value)} bg="gray.700" color="white">
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
            </Select>
          </FormControl>
          <FormControl id="dateOfHire" mb={4} isRequired>
            <FormLabel>Date of Hire</FormLabel>
            <Input type="date" value={dateOfHire} onChange={e => setDateOfHire(e.target.value)} bg="gray.700" color="white" />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Update Employee
          </Button>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditEmployee;
