import { userRepository } from './../repositories/userRepository';
import { User } from './../entities/User';
import IDbService from '../interfaces/services/IDbService';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

export default class UserDbService implements IDbService<User> {
  private static instance: UserDbService;

  private constructor() {}

  static getInstance(): UserDbService {
    if (!UserDbService.instance) {
      UserDbService.instance = new UserDbService();
    }
    return UserDbService.instance;
  }

  async findById(id: number): Promise<User> {
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { id } }); // check behavior
      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); // check behavior
      throw new Error('undefined error'); // check error
    }
  }

  async findByEmail(email: string): Promise<User> {
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { email } });
      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); // check behavior
      throw new Error('undefined error'); // check error
    }
  }

  async deleteById(id: number): Promise<User> {
    let user: User;

    try {
      user = await this.findById(id);
      await userRepository.delete(id);
      return user;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
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

  async listAll(): Promise<Array<User>>{
    let users: Array<User> = [];
    try {
      users = await userRepository.find({
        select: ['id', 'name', 'email', 'birth_date'],
      });
      return users;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message);
      throw new Error('undefined error');
    }
  }

  async checkIfUserAlreadyExist(email: string): Promise<boolean> {
    try {
      await this.findByEmail(email);
      return true;
    } catch (error) {
      return false;
    }
  }
}
