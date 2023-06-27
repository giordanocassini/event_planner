import { Response, NextFunction } from 'express';
import { User } from './../entities/User';
import { userRepository } from './../repositories/userRepository';
import CustomRequest from '../interfaces/CustomRequest';

export const findUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { email } = req.body;

  let user: User;

  try {
    user = await userRepository.findOneOrFail({ where: { email } });
  } catch (error) {
    return res.status(404).send('User not found!');
  }

  req.body.user = user;
  
  next();
};
