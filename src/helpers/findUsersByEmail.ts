import { User } from '../entities/User';
import UserDbService from '../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

export const findUsersByEmail = async (managers: Array<string>): Promise<Array<User>> => {
  const users: Array<User> = [];

  for (const manager of managers) {
    try {
      const user = await userDbService.findByEmail(manager);
      users.push(user);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('undefined error');
    }
  }

  return users;
};
