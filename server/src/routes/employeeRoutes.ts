import express from 'express';
import { addEmployee, editEmployee, removeEmployee } from '../controllers/employee/employeeCommandController';
import { getAllEmployees, getEmployee } from '../controllers/employee/employeeQueryController';
import { protect } from '../middleware/authMiddleware';
const router = express.Router();

router.get('/employees', protect,getAllEmployees);
router.get('/employees/:id', protect,getEmployee);
router.post('/employees', protect,addEmployee);
router.put('/employees/:id', protect,editEmployee);
router.delete('/employees/:id', protect,removeEmployee);

export default router;
