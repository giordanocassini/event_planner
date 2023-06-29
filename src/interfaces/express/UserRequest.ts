import { Request } from 'express';
import { User } from '../../entities/User';

// this interface may not be necessary due to logic made on @types/express folder,
// anyway it expoxes better what i1m doing
export default interface UserRequest extends Request {
  user: User;
}
