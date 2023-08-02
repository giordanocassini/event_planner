import { Express } from 'express-serve-static-core';
import { User } from '../../src/entities/User';
import { Event } from '../../src/entities/Event';

// this loigic made possible insert "user" property onto Resquest obejct
declare global {
  namespace Express {
    interface Request {
      user: User;
      users: Array<User>;
      event: Event;
    }
  }
}
