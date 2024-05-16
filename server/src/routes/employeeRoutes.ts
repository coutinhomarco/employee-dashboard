import express from 'express';
import { addEmployee, editEmployee, removeEmployee } from '../controllers/employeeCommandController';
import { getAllEmployees, getEmployee } from '../controllers/employeeQueryController';

const router = express.Router();

router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployee);
router.post('/employees', addEmployee);
router.put('/employees/:id', editEmployee);
router.delete('/employees/:id', removeEmployee);

export default router;
