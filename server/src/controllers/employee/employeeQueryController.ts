import { Request, Response } from 'express';
import {EmployeeQueryService} from '../../services/employee/employeeQueryService';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const result = await EmployeeQueryService.getEmployees();
    return res.status(result?.status).json({ message: result?.message || null, data: result?.data || null });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add employee' });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const result = await EmployeeQueryService.getEmployeeById(req.params.id);
    return res.status(result?.status).json({ message: result?.message || null, data: result?.data || null });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add employee' });
  }
};
