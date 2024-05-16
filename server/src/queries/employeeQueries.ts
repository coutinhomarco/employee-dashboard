import Employee from '../models/employeeModel';

export const getAllEmployeesQuery = async () => {
  return await Employee.find();
};

export const getEmployeeByIdQuery = async (id: string) => {
  return await Employee.findById(id);
};
