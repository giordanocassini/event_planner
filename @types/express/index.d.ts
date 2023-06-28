import { Express } from 'express-serve-static-core';
import { User } from '../../src/entities/User';

// this loigic made possible insert "user" property onto Resquest obejct
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
