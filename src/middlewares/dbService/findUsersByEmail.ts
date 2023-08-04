import { Request, Response, NextFunction } from 'express';
import { User } from '../../entities/User';
import UserRequest from '../../interfaces/express/UserRequest';
import UserDbService from '../../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

// this was turned into a helper

export const findUsersByEmail = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { managers } = req.body;

  if (!Array.isArray(managers)) {
    return res.status(404).send('Invalid type of parameters on request!');
  }

  const users: Array<User> = [];

  for (const manager of managers) {
    try {
      const user = await userDbService.findByEmail(manager);
      users.push(user);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('undefined error');
    }
  }

  req.users = users;

  next();
};
