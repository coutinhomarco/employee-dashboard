import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/employeeModel';

dotenv.config();

const mongoUri = process.env.DATABASE_URL as string;

const employees = [
  {
    name: 'John Doe',
    position: 'Software Engineer',
    department: 'Engineering',
    dateOfHire: new Date('2020-06-25'),
  },
  {
    name: 'Jane Smith',
    position: 'Product Manager',
    department: 'Product',
    dateOfHire: new Date('2018-05-15'),
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');

    // Clean up the database
    await mongoose.connection.db.dropDatabase();

    // Insert employees
    await Employee.insertMany(employees);

    console.log('Database seeded successfully');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

seedDatabase();
