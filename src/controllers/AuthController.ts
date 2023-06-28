import { validate } from 'class-validator';
import { User } from './../entities/User';
import { userRepository } from './../repositories/userRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import UserRequest from '../interfaces/UserRequest';

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

  //stop refactor here

  static async changePassword (req: Request, res: Response) {

    let payload = <any>res.locals.jwtPayLoad;
    console.log("🚀 ~ file: AuthController.ts:33 ~ AuthController ~ changePassword= ~ payload:", payload)

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

    if (!AuthController.checkIfUnencryptedPasswordIsValid(oldPassword, user.password)) {
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
