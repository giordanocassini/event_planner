import { Request, Response, NextFunction } from 'express';
import { User } from '../../entities/User';
import UserRequest from '../../interfaces/express/UserRequest';
import UserDbService from '../../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

export const findUsersByEmail = async (req: UserRequest, res: Response, next: NextFunction) => {

  const { managers } = req.body;

  if (!Array.isArray(managers)) {
    return res.status(404).send('Invalid type of parameters on request!');
  }

  managers.map(async (manager: string, index: number) => {
    let user: User;

    try {
      user = await userDbService.findByEmail(manager);
      req.users.push(user);
    } catch (error) {
      return res.status(404).send(`User ${managers[index]} not found`);
    }
  });
};
