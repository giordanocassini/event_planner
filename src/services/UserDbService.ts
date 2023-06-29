import { userRepository } from './../repositories/userRepository';
import { User } from './../entities/User';
import IDbService from '../interfaces/services/IDbService';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

export default class UserDbService implements IDbService<User> {

  private static instance: UserDbService;
  
  private constructor(){};

  public static getInstance(): UserDbService {
    if (!UserDbService.instance) {
      UserDbService.instance = new UserDbService();
    }
    return UserDbService.instance;
  }

  async findById(id: number): Promise<User> {
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { id: Number(id) } }); // check behavior
      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error('User not found'); // check behavior
      throw new Error('undefined error');
    }
  }

  async findByEmail(email: string): Promise<User> {
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { email } });
      return user;
    } catch (error) {
      throw new Error('undefined error');
    }
  }

  async deleteById(id: number): Promise<User> {
    const user: User = await this.findById(id);

    try {
      await userRepository.delete(id);
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) throw new Error(error.message);
      throw new Error('undefined error');
    }
  }

  async insert(data: User): Promise<User> {
    try {
      await userRepository.save(data);
    } catch (error) {
      throw new Error('undefined error');
    }
    return data;
  }

  createUser(name: string, email: string, birth_date: Date, password: string): User {
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


