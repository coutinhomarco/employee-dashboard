import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Input, Text, Spinner } from '@chakra-ui/react';
import Layout from '../app/components/Layout';

type Employee = {
  _id: string;
  name: string;
  position: string;
  department: string;
  dateOfHire: string;
};

const Home = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const router = useRouter();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/employees`);
      if (!response.ok) {
        throw new Error('Failed to initiate employee retrieval.');
      }
      const data = await response.json();
      pollJobStatus(data.data);
    } catch (error) {
      setError('Failed to fetch employees. Please try again later.');
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [apiUrl]);

  const pollJobStatus = async (jobId: string) => {
    try {
      const interval = setInterval(async () => {
        const response = await fetch(`${apiUrl}/api/job/${jobId}/status`);
        const data = await response.json();

        if (data.state === 'completed') {
          clearInterval(interval);
          if (Array.isArray(data.result)) {
            setEmployees(data.result);
          } else {
            if (data.progress === 100) {
              fetchEmployees();
              return;
            }
            setError('Invalid data format received.');
            console.error('Invalid data format:', data.result);
          }
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

  const handleDelete = async (id: string) => {
    const previousEmployees = employees;

    // Optimistically update the state
    setEmployees(employees.filter(employee => employee._id !== id));

    try {
      const response = await fetch(`${apiUrl}/api/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to initiate employee deletion.');
      }
      const data = await response.json();
      pollJobStatus(data.data);
    } catch (error) {
      // Revert to the previous state if the deletion fails
      setEmployees(previousEmployees);
      setError('Failed to delete employee. Please try again later.');
      console.error(error);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {loading && <Spinner size="xl" />}
      <Box mb={4}>
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Position</Th>
            <Th>Department</Th>
            <Th>Date of Hire</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredEmployees.map(employee => (
            <Tr key={employee._id}>
              <Td>{employee.name}</Td>
              <Td>{employee.position}</Td>
              <Td>{employee.department}</Td>
              <Td>{new Date(employee.dateOfHire).toLocaleDateString('en-US')}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  mr={2}
                  onClick={() => router.push(`/edit-employee?id=${employee._id}`)}
                >
                  Edit
                </Button>
                <Button colorScheme="red" onClick={() => handleDelete(employee._id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Layout>
  );
};

export default Home;