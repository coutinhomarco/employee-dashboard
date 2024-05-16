import { Request, Response } from 'express';
import { addEmployeeCommand, editEmployeeCommand, removeEmployeeCommand } from '../commands/employeeCommands';

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await addEmployeeCommand(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

export const editEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await editEmployeeCommand(req.params.id, req.body);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

export const removeEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await removeEmployeeCommand(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
