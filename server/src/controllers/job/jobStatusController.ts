import { Request, Response } from 'express';
import { commandQueue, queryQueue } from '../../utils/bullmq';

export const getJobStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const job = await commandQueue.getJob(id) || await queryQueue.getJob(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;
    const failedReason = job.failedReason;

    res.json({ id: job.id, state, progress, result, failedReason });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
