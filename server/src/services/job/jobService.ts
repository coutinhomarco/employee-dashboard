import { commandQueue, queryQueue } from '../../utils/bullmq';

export class JobService {

  static async getJobStatus(id: string): Promise<{id?: string, state?: string, progress: number | object, result: string, failedReason: string}> {
    const job = await commandQueue.getJob(id) || await queryQueue.getJob(id);
    if (!job) {
      throw new Error('Job not found');
    }

    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;
    const failedReason = job.failedReason;

    return { id: job.id, state, progress, result, failedReason };
  }
}
