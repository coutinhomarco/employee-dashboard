import {  EmployeeType } from '../../types/employee';
import Employee from '../models/employeeModel';

export const addEmployeeCommand = async (data: EmployeeType) => {
  return await Employee.create(data);
};

export const editEmployeeCommand = async (id: string, data: EmployeeType) => {
  return await Employee.findByIdAndUpdate(id, data);
};

export const removeEmployeeCommand = async (id: string) => {
  return await Employee.findByIdAndDelete(id);
};
