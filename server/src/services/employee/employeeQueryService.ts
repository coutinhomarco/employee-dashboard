import { queryQueue } from '../../utils/bullmq';
import { ReturnInterface } from '../../utils/interfaces/returnInterface';
export class EmployeeQueryService {
  static async getEmployees(): Promise<ReturnInterface> {
    try {
      const job = await queryQueue.add('getAllEmployees', {}, {jobId: `getAllEmployees-${Date.now()}`})    
      return { status: 200, message: 'Employees retrieval in progress', data: job.id};
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }
  static async getEmployeeById(id: string): Promise<ReturnInterface> {  
    try {      
      if (!id) {
        return { status: 400, message: 'Employee ID is required' };
      }
      const job = await queryQueue.add('getEmployeeById', {id}, {jobId: `getEmployeeById-${id}-${Date.now()}`});
      return { status: 200, message: 'Employee retrieval in progress', data: job.id};
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  };
}