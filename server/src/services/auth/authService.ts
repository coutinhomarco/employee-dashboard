import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/userModel';

interface JwtPayload {
  id: string;
}

const secret = process.env.JWT_SECRET || 'secret';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

const registerUser = async (username: string, password: string): Promise<IUser> => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const user = new User({
    username,
    password,
  });

  await user.save();
  return user;
};

const loginUser = async (username: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ username }).exec() as IUser | null;

  if (!user) {
    return null;
  }
  const isPasswordMatch = await user.matchPassword(password);
  if (isPasswordMatch) {
    return user;
  }

  return null;
};

const verifyToken = async (token: string): Promise<IUser | null> => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password').exec() as IUser | null;
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
