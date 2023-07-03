import { formatDate } from './../helpers/formatDate';
import { Response, Request } from 'express';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import { userRepository } from '../repositories/userRepository';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import UserFactory from '../factories/UserFactory';
import UserDbService from '../services/UserDbService';

const userFactory: UserFactory = UserFactory.getInstance();
const userDbService: UserDbService = UserDbService.getInstance();

export class UserController {
  static async createUser(req: Request, res: Response) {
    const { name, email, password, birth_date } = req.body;

    if (await userDbService.checkIfUserAlreadyExist(email)) return res.status(409).send('Email already in use');

    let birthDateObject: Date;
    try {
      birthDateObject = formatDate(birth_date);
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message);
      return res.status(500).send(error);
    }

    const encryptedPw = bcrypt.hashSync(password, 10);

    const user: User = userFactory.createInstance(name, email, birthDateObject, encryptedPw);

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    
    try {
      await userDbService.insert(user);
    } catch (error) {
      return res.status(500).json(error);
    }

    return res.status(201).json(user);
  }

  static async deleteUser(req: Request, res: Response) {
    const id: number = Number(req.params.id);
    
    let user: User;

    try {
      user = await userDbService.deleteById(id);
    } catch (error) {
      if (error instanceof Error) return res.status(400).json(error.message);
      return res.status(500).json(error);
    }

    return res.status(200).send(user);
  }

  static async editUser(req: Request, res: Response) {
    const id = req.params.id;

    const { name, email, birth_date } = req.body;
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      if (error instanceof EntityNotFoundError) return res.status(404).send('User not found');
      return res.status(500).json(error);
    }

    let new_birth_date;
    try {
      let splitDate = birth_date.split('/');
      splitDate.reverse().join('/');
      new_birth_date = new Date(splitDate);
    } catch (error) {
      return res.status(400).send('Invalid Date Format');
    }

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
      try {
        const userWithSameEmail = await userRepository.findOne({
          where: { email: user.email },
        });
        if (userWithSameEmail) return res.status(409).send('Email already in use');
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    if (birth_date) {
      user.birth_date = new_birth_date;
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await userRepository.save(user);
    } catch (error) {
      return res.status(500).json(error);
    }

    return res.status(204).send();
  }

  static async listAll(req: Request, res: Response) {
    let users: Array<User> = [];
    try {
      users = await userRepository.find({
        select: ['id', 'name', 'email', 'birth_date'],
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) return res.status(404).send('No users to show');
      return res.status(500).json(error);
    }
    return res.status(200).send(users);
  }

  static async getOneById(req: Request, res: Response) {
    const id = req.params.id;
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { id: Number(id) },
        select: ['id', 'name', 'email', 'birth_date'],
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) return res.status(404).send('User not found');
      return res.status(500).json(error);
    }

    return res.status(200).send(user);
  }
}
