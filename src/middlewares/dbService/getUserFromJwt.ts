import { Request, Response, NextFunction } from 'express';
import { User } from '../../entities/User';
import UserRequest from '../../interfaces/express/UserRequest';
import UserDbService from '../../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

// for now, this middleware only gets id info from jwtPayload and not from req.params.

export const getUserFromJwt = async (req: UserRequest, res: Response, next: NextFunction) => {
  let jwtPayLoad = res.locals.jwtPayLoad;

  const { id } = jwtPayLoad;

  let user: User;

  try {
    user = await userDbService.findById(id);
  } catch (error) {
    if (error instanceof Error) return res.status(400).send(error.message);
    return res.status(500).send(error);
  }

  req.user = user;

  next();
};
