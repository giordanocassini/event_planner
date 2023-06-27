import { validate } from 'class-validator';
import { User } from './../entities/User';
import { userRepository } from './../repositories/userRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import CustomRequest from '../interfaces/CustomRequest';

export class AuthController {
  static async auth(req: CustomRequest, res: Response) {
    const unencryptedPassword = req.body.password;

    const user: User = req.body.user;

    if (!AuthController.checkIfUnencryptedPasswordIsValid(unencryptedPassword, user.password)) {
      return res.status(401).send('Email or password not valid!');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? '', { expiresIn: '8h' }); //Alterar o jwt secret

    const { password: _, ...userLogin } = user; // this removes password from user object creating userLogin without it

    return res.json({ user: userLogin, token: token });
  }

  static changePassword = async (req: Request, res: Response) => {
    const token = <any>req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send('Not logged.');
    }

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).end();
      }
      return res.status(400).end();
    }

    const { id }: any = payload;

    let { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      return res.status(400).send();
    }

    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return res.status(401).send('Old password not match');
    }

    if (!this.checkIfUnencryptedPasswordIsValid(oldPassword, user.password)) {
      return res.status(401).send('Old password not match');
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    newPassword = bcrypt.hashSync(newPassword, 10);
    user.password = newPassword;

    userRepository.save(user);

    return res.status(204).send('Password changed!');
  };

  static checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, encryptedPassword: string){
    return bcrypt.compareSync(unencryptedPassword, encryptedPassword);
}
}
