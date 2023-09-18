import { userRepository } from './../repositories/userRepository';
import { User } from './../entities/User';
import IFactory from '../interfaces/factories/IFactory';

export default class UserFactory implements IFactory<User> {

  private static instance: UserFactory;

  private constructor() {}

  static getInstance(): UserFactory {
    if (!UserFactory.instance) {
      UserFactory.instance = new UserFactory();
    }
    return UserFactory.instance;
  }

  createInstance(name: string, email: string, birth_date: Date, password: string): User {
    try {
      const user: User = userRepository.create({
        name,
        email,
        birth_date,
        password,
      });

      return user;
    } catch (error) {
      throw new Error('unable to create instance');
    }
  }
}
