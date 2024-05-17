import { log } from 'console';
import { Employee } from '../../../types/employee';

export const validateEmployeeData = (data: Employee) => {
  if (!data.name) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (!data.position) {
    return { isValid: false, message: 'Position is required' };
  }

  if (!data.department) {
    return { isValid: false, message: 'Department is required' };
  }

  if (!data.dateOfHire) {
    log(data);
    return { isValid: false, message: 'Date of hire is required' };
  }

  if (typeof data.dateOfHire !== 'string') {
    return { isValid: false, message: 'Date of hire must be a string' };
  }

  if (new Date(data.dateOfHire) > new Date()) {
    return { isValid: false, message: 'Date of hire cannot be in the future' };
  }

  return { isValid: true, message: '' };
};
