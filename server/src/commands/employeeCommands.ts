import { createEmployee, updateEmployee, deleteEmployee } from '../services/employeeCommandService';

export const addEmployeeCommand = async (data: any) => {
  return await createEmployee(data);
};

export const editEmployeeCommand = async (id: string, data: any) => {
  return await updateEmployee(id, data);
};

export const removeEmployeeCommand = async (id: string) => {
  return await deleteEmployee(id);
};
