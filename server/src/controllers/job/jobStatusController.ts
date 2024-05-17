import { Request, Response } from 'express';
import { JobService } from '../../services/job/jobService'; // Adjust the path if needed

export const getJobStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const jobStatus = await JobService.getJobStatus(id);
    res.json(jobStatus);
  } catch (error: any) {
    if (error.message === 'Job not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
