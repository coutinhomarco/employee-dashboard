import { getEmployees, getEmployeeById } from '../services/employeeQueryService';

export const getAllEmployeesQuery = async () => {
  return await getEmployees();
};

export const getEmployeeByIdQuery = async (id: string) => {
  return await getEmployeeById(id);
};
