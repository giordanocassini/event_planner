import { Request } from 'express';
import { User } from '../entities/User';

export default interface CustomRequest extends Request {
  user?: User;
}