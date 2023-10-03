import { Request, Response, NextFunction } from 'express';
import { User } from '../../entities/User';
import UserRequest from '../../interfaces/express/UserRequest';
import UserDbService from '../../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

export const findUserByEmail = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { email } = req.body;

  let user: User;

  try {
    user = await userDbService.findByEmail(email);
  } catch (error) {
    if (error instanceof Error) return res.status(404).send(error.message);
    return res.status(500).send(error);
  }

  req.user = user;

  next();
};
