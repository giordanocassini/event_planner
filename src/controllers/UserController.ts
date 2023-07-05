import { formatDate } from './../helpers/formatDate';
import { Response, Request } from 'express';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import UserFactory from '../factories/UserFactory';
import UserDbService from '../services/UserDbService';
import UserRequest from '../interfaces/express/UserRequest';

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

    const { password: _, ...returnableUser } = user; // this removes password from user object creating returnableUser without it
    return res.status(201).send(returnableUser);
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

    const { password: _, ...returnableUser } = user;
    return res.status(201).send(returnableUser);
  }

  static async editUser(req: UserRequest, res: Response) {
    const user: User = req.user;

    const { name, email, birth_date } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      if (await userDbService.checkIfUserAlreadyExist(email)) return res.status(409).send('Email already in use');
      user.email = email;
    }
    if (birth_date) {
      let birthDateObject: Date;
      try {
        birthDateObject = formatDate(birth_date);
      } catch (error) {
        if (error instanceof Error) return res.status(400).send(error.message);
        return res.status(500).send(error);
      }
      user.birth_date = birthDateObject;
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await userDbService.insert(user);
    } catch (error) {
      return res.status(500).json(error);
    }
    const { password: _, ...returnableUser } = user;
    return res.status(201).send(returnableUser);
  }

  static async listAll(req: Request, res: Response) {
    let users: Array<User> = [];
    try {
      users = await userDbService.listAll();
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).json(error);
    }
    return res.status(200).send(users);
  }

  static async getOneById(req: Request, res: Response) {
    const id: number = Number(req.params.id);

    let user: User;

    try {
      user = await userDbService.findById(id);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).json(error);
    }

    const { password: _, ...returnableUser } = user;
    return res.status(201).send(returnableUser);
  }
}
