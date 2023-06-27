import { findUser } from './../middlewares/findUser';
import { checkPassword } from '../middlewares/checkPassword';
import { checkJwt } from './../middlewares/checkJwt';
import { AuthController } from '../controllers/AuthController';
import { Router } from 'express';
const router = Router();

router.post('/login', [checkPassword], [findUser], AuthController.auth);

router.put('/change-password', [checkJwt], AuthController.changePassword);

export default router;
