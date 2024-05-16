import { queryQueue, queryQueueEvents } from '../utils/bullmq';

export const getEmployees = async () => {
  try {
    const job = await queryQueue.add('getAllEmployees', {});  
    return { status: 200, message: 'Employees retrieval in progress', data: job.id};
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const getEmployeeById = async (id: string) => {  
  try {
    if (!id) {
      return { status: 400, message: 'Employee ID is required' };
    }
    const job = await queryQueue.add('getEmployeeById', {});
    return { status: 200, message: 'Employee retrieval in progress', data: job.id};
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};