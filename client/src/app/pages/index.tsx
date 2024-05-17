import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Input } from '@chakra-ui/react';
import axios from 'axios';
import Layout from '../components/layout';

type Employee = {
  _id: string;
  name: string;
  position: string;
  department: string;
  dateOfJoining: string;
};

const Home = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/employees').then(response => {
      setEmployees(response.data);
    });
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`/api/employees/${id}`).then(() => {
      setEmployees(prev => prev.filter(employee => employee._id !== id));
    });
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
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
            <Th>Date of Joining</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredEmployees.map(employee => (
            <Tr key={employee._id}>
              <Td>{employee.name}</Td>
              <Td>{employee.position}</Td>
              <Td>{employee.department}</Td>
              <Td>{employee.dateOfJoining}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  mr={2}
                  onClick={() => {
                    // navigate to edit page
                  }}
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
