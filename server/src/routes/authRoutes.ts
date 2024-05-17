import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user: IUser = new User({ username, password });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        username: user.username,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export default router;
