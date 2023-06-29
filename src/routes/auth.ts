import { findUserById } from './../middlewares/dbService/findUserById';
import { findUserByEmail } from '../middlewares/dbService/findUserByEmail';
import { checkPassword } from '../middlewares/validations/checkPassword';
import { checkJwt } from '../middlewares/auth/checkJwt';
import { AuthController } from '../controllers/AuthController';
import { Router } from 'express';
const router = Router();

router.post('/login', [checkPassword], [findUserByEmail], AuthController.auth);

router.put('/change-password', [checkJwt], [findUserById], AuthController.changePassword);

export default router;
