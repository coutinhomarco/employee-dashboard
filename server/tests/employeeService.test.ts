import { EmployeeCommandService } from '../src/services/employee/employeeCommandService';
import { EmployeeQueryService } from '../src/services/employee/employeeQueryService';
import { mock, MockProxy } from 'jest-mock-extended';
import { Queue, Job } from 'bullmq';
import { Employee } from '../src/types/employee';

// Mocking the queryQueue and commandQueue
jest.mock('../src/utils/bullmq', () => {
  const actual = jest.requireActual('jest-mock-extended');
  return {
    queryQueue: actual.mock() as any,
    commandQueue: actual.mock() as any
  };
});

import { queryQueue, commandQueue } from '../src/utils/bullmq';

const mockJob: Job<any, any, string> = {
  id: 'job-id',
  queue: {} as Queue<any, any, string>,
  name: '',
  data: {},
  opts: {},
  progress: jest.fn(),
  logs: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  retry: jest.fn(),
  discard: jest.fn(),
  promote: jest.fn(),
  finished: jest.fn(),
  isCompleted: jest.fn(),
  isFailed: jest.fn(),
  getState: jest.fn(),
  moveToCompleted: jest.fn(),
  moveToFailed: jest.fn(),
  moveToDelayed: jest.fn(),
  log: jest.fn(),
} as unknown as Job<any, any, string>;

describe('Employee Service Validations', () => {
  let queryQueueMock: MockProxy<Queue<any, any, string>>;
  let commandQueueMock: MockProxy<Queue<any, any, string>>;

  beforeAll(() => {
    queryQueueMock = queryQueue as MockProxy<Queue<any, any, string>>;
    commandQueueMock = commandQueue as MockProxy<Queue<any, any, string>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEmployees', () => {
    it('should add a job to queryQueue and return status 200', async () => {
      queryQueueMock.add.mockResolvedValueOnce(mockJob);

      const response = await EmployeeQueryService.getEmployees();

      expect(response).toEqual({ status: 200, message: 'Employees retrieval in progress', data: 'job-id' });
      expect(queryQueueMock.add).toHaveBeenCalledWith('getAllEmployees', {}, expect.any(Object));
    });
  });

  describe('getEmployeeById', () => {
    it('should return status 400 if no id is provided', async () => {
      const response = await EmployeeQueryService.getEmployeeById('');

      expect(response).toEqual({ status: 400, message: 'Employee ID is required' });
      expect(queryQueueMock.add).not.toHaveBeenCalled();
    });

    it('should add a job to queryQueue and return status 200', async () => {
      queryQueueMock.add.mockResolvedValueOnce(mockJob);

      const response = await EmployeeQueryService.getEmployeeById('123');

      expect(response).toEqual({ status: 200, message: 'Employee retrieval in progress', data: 'job-id' });
      expect(queryQueueMock.add).toHaveBeenCalledWith('getEmployeeById', {}, expect.any(Object));
    });
  });

  describe('createEmployee', () => {
    const baseEmployee: Employee = {
      name: 'John',
      position: 'Developer',
      department: 'Engineering',
      dateOfHire: new Date().toISOString(),
    };

    it('should return status 400 if any required field is missing', async () => {
      const invalidData: Employee = {
        ...baseEmployee,
        name: '',
      };

      const response = await EmployeeCommandService.createEmployee(invalidData);

      expect(response).toEqual({ status: 400, message: 'Name is required' });
      expect(commandQueueMock.add).not.toHaveBeenCalled();
    });

    it('should return status 400 if dateOfHire is in the future', async () => {
      const invalidData: Employee = {
        ...baseEmployee,
        dateOfHire: new Date(Date.now() + 86400000).toISOString(), // Future date
      };

      const response = await EmployeeCommandService.createEmployee(invalidData);

      expect(response).toEqual({ status: 400, message: 'Date of hire cannot be in the future' });
      expect(commandQueueMock.add).not.toHaveBeenCalled();
    });

    it('should return status 400 if dateOfHire is not a string', async () => {
      const invalidData = {
        ...baseEmployee,
        dateOfHire: new Date(), // Date object instead of string
      } as unknown as Employee;

      const response = await EmployeeCommandService.createEmployee(invalidData);

      expect(response).toEqual({ status: 400, message: 'Date of hire must be a string' });
      expect(commandQueueMock.add).not.toHaveBeenCalled();
    });

    it('should add a job to commandQueue and return status 201', async () => {
      const validData: Employee = baseEmployee;

      commandQueueMock.add.mockResolvedValueOnce(mockJob);

      const response = await EmployeeCommandService.createEmployee(validData);

      expect(response).toEqual({ status: 201, message: 'Employee addition in progress', data: 'job-id' });
      expect(commandQueueMock.add).toHaveBeenCalledWith('addEmployee', expect.any(Object), expect.any(Object));
    });
  });

  describe('updateEmployee', () => {
    const baseEmployee: Employee = {
      name: 'John',
      position: 'Developer',
      department: 'Engineering',
      dateOfHire: new Date().toISOString(),
    };

    it('should return status 400 if any required field is missing', async () => {
      const invalidData: Employee = {
        ...baseEmployee,
        name: '',
      };

      const response = await EmployeeCommandService.updateEmployee('123', invalidData);

      expect(response).toEqual({ status: 400, message: 'Name is required' });
      expect(commandQueueMock.add).not.toHaveBeenCalled();
    });

    it('should return status 400 if dateOfHire is in the future', async () => {
      const invalidData: Employee = {
        ...baseEmployee,
        dateOfHire: new Date(Date.now() + 86400000).toISOString(), // Future date
      };

      const response = await EmployeeCommandService.updateEmployee('123', invalidData);

      expect(response).toEqual({ status: 400, message: 'Date of hire cannot be in the future' });
      expect(commandQueueMock.add).not.toHaveBeenCalled();
    });

    it('should return status 400 if dateOfHire is not a string', async () => {
      const invalidData = {
        ...baseEmployee,
        dateOfHire: new Date(), // Date object instead of string
      } as unknown as Employee;

      const response = await EmployeeCommandService.updateEmployee('123', invalidData);

      expect(response).toEqual({ status: 400, message: 'Date of hire must be a string' });
      expect(commandQueueMock.add).not.toHaveBeenCalled();
    });

    it('should add a job to commandQueue and return status 201', async () => {
      const validData: Employee = baseEmployee;

      commandQueueMock.add.mockResolvedValueOnce(mockJob);

      const response = await EmployeeCommandService.updateEmployee('123', validData);

      expect(response).toEqual({ status: 201, message: 'Employee update in progress', data: 'job-id' });
      expect(commandQueueMock.add).toHaveBeenCalledWith('editEmployee', expect.any(Object), expect.any(Object));
    });
  });

  describe('deleteEmployee', () => {
    it('should return status 400 if no id is provided', async () => {
      const response = await EmployeeCommandService.deleteEmployee('');

      expect(response).toEqual({ status: 400, message: 'Employee ID is required' });
      expect(commandQueueMock.add).not.toHaveBeenCalled();
    });

    it('should add a job to commandQueue and return status 201', async () => {
      commandQueueMock.add.mockResolvedValueOnce(mockJob);

      const response = await EmployeeCommandService.deleteEmployee('123');

      expect(response).toEqual({ status: 201, message: 'Employee removal in progress', data: 'job-id' });
      expect(commandQueueMock.add).toHaveBeenCalledWith('removeEmployee', { id: '123' }, expect.any(Object));
    });
  });
});
