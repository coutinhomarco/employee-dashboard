import { commandQueue } from '../utils/bullmq';
import { Employee } from '../types/employee';
import { validateEmployeeData } from '../utils/validations/validateEmployee';

export const createEmployee = async (data: Employee) => {
  try {
    const { isValid, message } = validateEmployeeData(data);
    if (!isValid) {
      return { status: 400, message };
    }
    const modifiedDate = new Date(data.dateOfHire);
    const newData = { ...data, dateOfHire: modifiedDate.toISOString() };
    const job = await commandQueue.add('addEmployee', newData, { jobId: `addEmployee-${Date.now()}` });
    return { status: 201, message: 'Employee addition in progress', data: job.id };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const updateEmployee = async (id: string, data: Employee) => {
  try {
    const { isValid, message } = validateEmployeeData(data);
    if (!isValid) {
      return { status: 400, message };
    }

    const modifiedDate = new Date(data.dateOfHire);
    const newData = { ...data, dateOfHire: modifiedDate.toISOString() };
    const job = await commandQueue.add('editEmployee', { id, ...newData }, { jobId: `editEmployee-${id}-${Date.now()}` });
    return { status: 201, message: 'Employee update in progress', data: job.id };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    if (!id) {
      return { status: 400, message: 'Employee ID is required' };
    }
    const job = await commandQueue.add('removeEmployee', { id }, { jobId: `removeEmployee-${id}-${Date.now()}` });
    return { status: 201, message: 'Employee removal in progress', data: job.id };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
