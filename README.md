# Employee Management Dashboard

This is a simple employee management dashboard built with Next.js, Chakra UI, and a Node.js backend with Express and MongoDB. The dashboard allows users to manage a list of employees, including adding, editing, and deleting employee records. The project utilizes CQRS (Command Query Responsibility Segregation) architecture, BullMQ for job queuing, and Redis for efficient data caching and message brokering.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)

## Features
- View a list of employees
- Add a new employee
- Edit an existing employee's details
- Delete an employee
- Efficiently manage background tasks using BullMQ and Redis
- Segregated command and query operations using CQRS

## Technologies Used
- **Frontend**: Next.js, React, Chakra UI
- **Backend**: Node.js, Express, TypeScript, BullMQ, Redis, MongoDB
- **Database**: MongoDB
- **Styling**: Chakra UI

## Architecture

The Employee Management Dashboard follows a modern architecture pattern incorporating CQRS, BullMQ, and Redis to ensure scalability, maintainability, and efficient handling of background jobs. 

### CQRS (Command Query Responsibility Segregation)
CQRS separates the write (command) and read (query) operations of the system, providing a clear distinction between modifying data and retrieving data. This helps in scaling read and write operations independently and enhances the maintainability of the codebase.

### BullMQ
BullMQ is used for job queuing and processing. It handles background tasks like creating, updating, and deleting employee records, ensuring that these operations are performed asynchronously and efficiently.

### Redis
Redis is used as a message broker and caching layer. It improves the performance of the system by caching frequently accessed data and managing the job queue.

Here is an overview of the project's architecture:

![Architecture Diagram](docs/diagram.png)

## Installation

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn
- MongoDB instance
- Redis instance

### Clone the Repository
```bash
git clone https://github.com/your-username/employee-management-dashboard.git
cd employee-management-dashboard
```

### Install Dependencies
```bash
# For both frontend and backend
npm install
# or
yarn install
```

## Running the Application

### Setup Environment Variables
Create a `.env` file in the `server` directory and a `.env.local` file in the `client` directory and add the following environment variables:

#### `.env` (Server)
```env
MONGODB_URI=mongodb://localhost:27017/your-db-name
REDIS_URL=redis://localhost:6379
```

#### `.env.local` (Client)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Start the Backend Server
```bash
cd server
npm run dev
# or
yarn dev
```

### Start the Frontend Server
```bash
cd client
npm run dev
# or
yarn dev
```

### Access the Application
Open your browser and go to `http://localhost:3000`.

## Project Structure

```plaintext
employee-management-dashboard/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── _app.tsx
│   │   │   │   ├── add-employee.tsx
│   │   │   │   ├── edit-employee.tsx
│   │   │   │   └── index.tsx
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
├── server/
│   ├── src/
│   │   ├── commands/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── queries/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── bullmq.ts
│   │   └── index.ts
│   ├── tests/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   ├── jest.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── docs/
│   └── diagram.png
├── README.md
└── package.json
```

## API Endpoints

### Employee Endpoints
- `GET /api/employees`: Retrieve all employees
- `GET /api/employees/:id`: Retrieve a single employee by ID
- `POST /api/employees`: Create a new employee
- `PUT /api/employees/:id`: Update an employee by ID
- `DELETE /api/employees/:id`: Delete an employee by ID

### Job Status Endpoints
- `GET /api/job/:id/status`: Retrieve the status of a job by job ID

## Testing

### Running Tests
This project uses Jest for testing. To run the tests, use the following command:

```bash
cd server
npm test
# or
yarn test
```

### Example Test File Structure

#### `server/tests/controllers/employeeCommandController.test.ts`
```typescript
import request from 'supertest';
import { app } from '../../src/index';
import { Employee } from '../../src/models/employeeModel';

describe('Employee Command Controller', () => {
  it('should create a new employee', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send({
        name: 'John Doe',
        position: 'Software Engineer',
        department: 'Engineering',
        dateOfHire: '2023-01-01',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Employee addition in progress');
  });

  // Add more tests for update and delete operations
});
```

## Future Enhancements
- Add authentication and authorization
- Implement pagination for employee list
- Add unit and integration tests
- Enhance error handling and validation
