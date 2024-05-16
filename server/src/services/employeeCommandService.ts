import Employee from '../models/employeeModel';

export const createEmployee = async (data: any) => {
  const employee = new Employee(data);
  return await employee.save();
};

export const updateEmployee = async (id: string, data: any) => {
  return await Employee.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEmployee = async (id: string) => {
  return await Employee.findByIdAndDelete(id);
};