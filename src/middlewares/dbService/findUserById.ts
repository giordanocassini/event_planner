import { Request, Response, NextFunction } from 'express';
import { User } from '../../entities/User';
import UserRequest from '../../interfaces/express/UserRequest';
import UserDbService from '../../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

export const findUserById = async (req: UserRequest, res: Response, next: NextFunction) => {
  let jwtPayLoad = res.locals.jwtPayLoad;

  const { id } = jwtPayLoad;

  let user: User;

  try {
    user = await userDbService.findById(id);
  } catch (error) {
    return res.status(404).send({
      error,
      message: 'user not found',
    });
  }

  req.user = user;

  next();
};
