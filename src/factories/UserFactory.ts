import { userRepository } from './../repositories/userRepository';
import { User } from './../entities/User';
import IFactory from '../interfaces/factories/IFactory';

export default class UserFactory implements IFactory<User> {
  createInstance(name, email, birth_date, password): User {
    try {
      const user: User = userRepository.create({
        name,
        email,
        birth_date,
        password,
      });

      return user;
    } catch (error) {
      throw new Error('undefined error');
    }
  }
}
