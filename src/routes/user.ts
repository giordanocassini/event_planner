import { UserController } from './../controllers/UserController';
import { Router } from 'express';
import { checkJwt } from '../middlewares/auth/checkJwt';
import { checkPassword } from '../middlewares/validations/checkPassword';
import { findUserById } from '../middlewares/dbService/findUserById';

const router = Router();

router.route('/user')
.post([checkPassword], UserController.createUser)
.get([checkJwt], UserController.listAll);

router.route('/user/:id([0-9]+)')
.get([checkJwt], UserController.getOneById)
.delete([checkJwt], UserController.deleteUser)
.put([checkJwt], [findUserById], UserController.editUser); //don't see a business rule where a user can edit another, but for now i'll leave this endpoint on this route.

export default router;
