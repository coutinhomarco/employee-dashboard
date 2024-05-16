import { commandQueue } from '../utils/bullmq';

export const createEmployee = async (data: any) => {
  try {
    if (!data.name || !data.position || !data.department || !data.dateOfHire) {
      return { status: 400, message: 'All fields are required' };
    }
    await commandQueue.add('addEmployee', data);
    return { status: 201, message: 'Employee addition in progress' };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const updateEmployee = async (id: string, data: any) => {  
  try {
    if (!data.name || !data.position || !data.department || !data.dateOfHire) {
      return { status: 400, message: 'All fields are required' };
    }
    await commandQueue.add('editEmployee', { id, ...data });
    return { status: 201, message: 'Employee update in progress' };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const deleteEmployee = async (id: string) => {  
  try {
    if (!id) {
      return { status: 400, message: 'Employee ID is required' };
    }
    await commandQueue.add('removeEmployee', { id });
    return { status: 201, message: 'Employee removal in progress' };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};