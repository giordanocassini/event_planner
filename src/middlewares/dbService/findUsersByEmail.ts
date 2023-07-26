import { Request, Response, NextFunction } from 'express';
import { User } from '../../entities/User';
import UserRequest from '../../interfaces/express/UserRequest';
import UserDbService from '../../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

// this was turned into a helper

// export const findUsersByEmail = async (req: UserRequest, res: Response, next: NextFunction) => {
//   const { managers } = req.body;
//   console.log("🚀 ~ file: findUsersByEmail.ts:10 ~ findUsersByEmail ~ managers:", managers)

//   if (!Array.isArray(managers)) {
//     return res.status(404).send('Invalid type of parameters on request!');
//   }

//   const users: Array<User> = [];

//  managers.forEach(async (manager: string, index: number) => {
//     try {
//       const user = await userDbService.findByEmail(manager);
//       console.log("🚀 ~ file: findUsersByEmail.ts:21 ~ managers.forEach ~ user:", user)
//       users[index] = user;
//     } catch (error) {
//       if (error instanceof Error) return res.status(500).send(error.message);
//       return res.status(404).send(`User ${managers[index]} not found`);
//     }
//   });
  
  
//   req.users = users;
//   console.log("🚀 ~ file: findUsersByEmail.ts:30 ~ findUsersByEmail ~ users:", users)

//   next();
// };
