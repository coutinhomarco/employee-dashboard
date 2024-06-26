import { Request, Response } from 'express';
import authService from '../../services/auth/authService';

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await authService.registerUser(username, password);
    res.status(201).json({
      _id: user._id.toString(), // Ensure _id is a string
      username: user.username,
      token: authService.generateToken(user._id.toString()),
    });
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.message === 'Username already exists') {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(400).json({ message: 'Failed to register user', error });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await authService.loginUser(username, password);
    if (user) {
      return res.status(200).json({
        _id: user._id.toString(), // Ensure _id is a string
        username: user.username,
        token: authService.generateToken(user._id.toString()),
      });
    } else {
      console.log('Invalid credentials');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login', error });
  }
};
