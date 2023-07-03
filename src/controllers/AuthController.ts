import { validate } from 'class-validator';
import { User } from './../entities/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import UserRequest from '../interfaces/express/UserRequest';
import UserDbService from '../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

export class AuthController {
  static async auth(req: UserRequest, res: Response) {
    const unencryptedPassword = req.body.password;

    const user: User = req.user;

    if (!AuthController.checkIfUnencryptedPasswordIsValid(unencryptedPassword, user.password)) {
      return res.status(401).send('Email or password not valid!');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? '', { expiresIn: '8h' }); //Alterar o jwt secret

    const { password: _, ...userLogin } = user; // this removes password from user object creating userLogin without it

    return res.json({ user: userLogin, token: token });
  }

  static async changePassword(req: UserRequest, res: Response) {
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      return res.status(400).send();
    }

    const user: User = req.user;

    if (!AuthController.checkIfUnencryptedPasswordIsValid(oldPassword, user.password)) {
      return res.status(401).send('Old password do not match');
    }

    const newPasswordHashed = bcrypt.hashSync(newPassword, 10);
    user.password = newPasswordHashed;

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      userDbService.insert(user);
    } catch (error) {
      res.status(500).send('server failded');
    }
    return res.status(200).send('Password changed!');
  }

  static checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, encryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, encryptedPassword);
  }
}
