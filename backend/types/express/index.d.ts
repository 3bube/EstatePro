import { IUser } from "../../models/user.models";

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}

export {};
