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
