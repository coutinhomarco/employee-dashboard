import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { addEmployeeCommand, editEmployeeCommand, removeEmployeeCommand } from '../commands/employeeCommands';
import { getAllEmployeesQuery, getEmployeeByIdQuery } from '../queries/employeeQueries';

const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

export const commandQueue = new Queue('commandQueue', { connection });
export const queryQueue = new Queue('queryQueue', { connection });

export const commandQueueEvents = new QueueEvents('commandQueue', { connection });
export const queryQueueEvents = new QueueEvents('queryQueue', { connection });

export const commandWorker = new Worker('commandQueue', async job => {
  try {
    switch (job.name) {

      case 'addEmployee':
        await addEmployeeCommand(job.data);
        break;
      case 'editEmployee':
        await editEmployeeCommand(job.data.id, job.data);
        break;
      case 'removeEmployee':
        await removeEmployeeCommand(job.data.id);
        break;
      default:
        throw new Error('Unknown job name');
    }
  } catch (error) {
    console.log(error);
  }
}, { connection });

export const queryWorker = new Worker('queryQueue', async job => {
  try {    
    switch (job.name) {
      case 'getEmployeeById':        
        return await getEmployeeByIdQuery(job.data.id);
        break;
      case 'getAllEmployees':
        return await getAllEmployeesQuery();
        break;
      default:
        throw new Error('Unknown job name');
  }
  } catch (error) {
    console.log(error);
  }
}, { connection });
