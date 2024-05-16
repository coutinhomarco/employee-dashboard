import { Request, Response } from 'express';
import { getAllEmployeesQuery, getEmployeeByIdQuery } from '../queries/employeeQueries';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployeesQuery();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await getEmployeeByIdQuery(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};
