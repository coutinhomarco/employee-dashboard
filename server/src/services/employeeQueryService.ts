import Employee from '../models/employeeModel';


export const getEmployees = async () => {
    return await Employee.find();
  };
  
export const getEmployeeById = async (id: string) => {
    return await Employee.findById(id);
};
  