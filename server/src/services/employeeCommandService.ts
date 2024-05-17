import { commandQueue } from '../utils/bullmq';
import { Employee } from '../types/employee';


export const createEmployee = async (data: Employee) => {
  try {
    if (!data.name || !data.position || !data.department || !data.dateOfHire) {
      return { status: 400, message: 'All fields are required' };
    }
    if (data.dateOfHire > new Date().toISOString()) {
      return { status: 400, message: 'Date of hire cannot be in the future' };
    }
    if ( typeof data.dateOfHire !== 'string') {
      return { status: 400, message: 'Date of hire must be a string' };
    }
    const modifiedDate = new Date(data.dateOfHire);
    const newData = { ...data, dateOfHire: modifiedDate.toISOString() };
    const job = await commandQueue.add('addEmployee', newData, {jobId: `addEmployee-${Date.now()}`});
    return { status: 201, message: 'Employee addition in progress', data: job.id};
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const updateEmployee = async (id: string, data: Employee) => {  
  try {
    if (!data.name || !data.position || !data.department || !data.dateOfHire) {
      return { status: 400, message: 'All fields are required' };
    }
    if (data.dateOfHire > new Date().toISOString()) {
      return { status: 400, message: 'Date of hire cannot be in the future' };
    }
    if ( typeof data.dateOfHire !== 'string') {
      return { status: 400, message: 'Date of hire must be a string' };
    }
    const modifiedDate = new Date(data.dateOfHire);
    const newData = { ...data, dateOfHire: modifiedDate.toISOString() };
    const job = await commandQueue.add('editEmployee', { id, ...newData }, {jobId: `editEmployee-${id}-${Date.now()}`});
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
    const job = await commandQueue.add('removeEmployee', { id }, {jobId: `removeEmployee-${id}-${Date.now()}`});
    return { status: 201, message: 'Employee removal in progress', data: job.id };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};