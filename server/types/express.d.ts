import { IUser } from '../src/models/userModel';
interface UserPayload {
  _id: number;
  token: string;
  username: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
