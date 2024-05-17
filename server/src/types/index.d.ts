import { IUser } from '../../models/userModel'; // Adjust the path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
