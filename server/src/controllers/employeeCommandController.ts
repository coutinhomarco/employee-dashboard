import { Request, Response } from 'express';
import { createEmployee, updateEmployee, deleteEmployee } from '../services/employeeCommandService';

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const result = await createEmployee(req.body);
    return res.status(result?.status).json({ message: result?.message || null });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add employee' });
  }
};

export const editEmployee = async (req: Request, res: Response) => {
  try {
    const result = await updateEmployee(req.params.id, req.body);
    return res.status(result?.status).json({ message: result?.message || null, data: result?.data || null});
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update employee' });
  }
};

export const removeEmployee = async (req: Request, res: Response) => {
  try {
    const result = await deleteEmployee(req.params.id);
    return res.status(result?.status).json({ message: result?.message || null, data: result?.data || null });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove employee' });
  }
};
