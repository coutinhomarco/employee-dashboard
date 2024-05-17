import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Input, Text, Spinner, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react';
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
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

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

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    const previousEmployees = employees;

    // Optimistically update the state
    setEmployees(employees.filter(employee => employee._id !== employeeToDelete._id));

    try {
      const response = await fetch(`${apiUrl}/api/employees/${employeeToDelete._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to initiate employee deletion.');
      }
      const data = await response.json();
      pollJobStatus(data.data);
      onClose();
    } catch (error) {
      // Revert to the previous state if the deletion fails
      setEmployees(previousEmployees);
      setError('Failed to delete employee. Please try again later.');
      console.error(error);
      onClose();
    }
  };

  const openDeleteConfirm = (employee: Employee) => {
    setEmployeeToDelete(employee);
    onOpen();
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
          bg="gray.800"
          color="white"
        />
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color="white">Name</Th>
            <Th color="white">Position</Th>
            <Th color="white">Department</Th>
            <Th color="white">Date of Hire</Th>
            <Th color="white">Actions</Th>
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
                <Button colorScheme="red" onClick={() => openDeleteConfirm(employee)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader color={'gray'} fontSize="lg" fontWeight="bold">
              Delete Employee
            </AlertDialogHeader>

            <AlertDialogBody color={'gray'}>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
};

export default Home;
