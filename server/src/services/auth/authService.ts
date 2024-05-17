import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../../models/userModel';

interface JwtPayload {
  id: string;
}

const secret = process.env.JWT_SECRET || 'secret';
const generateToken = (id: string): string => {
  return jwt.sign({ id }, secret as string, {
    expiresIn: '30d',
  });
};

const registerUser = async (username: string, password: string): Promise<IUser> => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();
  return user;
};

const loginUser = async (username: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }

  return null;
};

const verifyToken = async (token: string): Promise<IUser | null> => {
  try {
    const decoded = jwt.verify(token, secret as string) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');
    return user || null;
  } catch (error) {
    return null;
  }
};

export default {
  generateToken,
  registerUser,
  loginUser,
  verifyToken,
};
