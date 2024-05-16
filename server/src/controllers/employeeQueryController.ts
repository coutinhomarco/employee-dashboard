import { Request, Response } from 'express';
import { getEmployees, getEmployeeById } from '../services/employeeQueryService';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const result = await getEmployees();
    return res.status(result?.status).json({ message: result?.message || null, data: result?.data || null });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add employee' });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const result = await getEmployeeById(req.params.id);
    return res.status(result?.status).json({ message: result?.message || null, data: result?.data || null });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add employee' });
  }
};
