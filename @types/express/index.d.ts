import { Express } from 'express-serve-static-core';
import { User } from '../../src/entities/User';
import { Event } from '../../src/entities/Event';

// this loigic made possible insert "user, users, myEvent" properties onto Resquest obejct
declare global {
  namespace Express {
    interface Request {
      user: User;
      users: Array<User>;
      myEvent: Event; //choose to name it myEvent for not going through conflict on global objects.
    }
  }
}
