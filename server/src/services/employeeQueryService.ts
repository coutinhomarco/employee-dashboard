import { queryQueue, queryQueueEvents } from '../utils/bullmq';

export const getEmployees = async () => {
  try {
    const job = await queryQueue.add('getAllEmployees', {});
    const employees = await job.waitUntilFinished(queryQueueEvents);
    return { status: 200, data: employees || [], message: employees ? null : 'No employees found'};
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const getEmployeeById = async (id: string) => {
  if (!id) {
    return { status: 400, message: 'Employee ID is required' };
  }

  try {
    const job = await queryQueue.add('getEmployeeById', {});
    const employee = await job.waitUntilFinished(queryQueueEvents);
    return { status: 200, data: employee || null, message: employee ? null : 'Employee not found'};
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};