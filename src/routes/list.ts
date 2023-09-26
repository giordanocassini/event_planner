import { ToDoListController } from '../controllers/ToDoListController';
import { Router } from 'express';
import { checkJwt } from '../middlewares/auth/checkJwt';
import { findEventById } from '../middlewares/dbService/findEventById';

const router = Router();

router.post('/content', [checkJwt], ToDoListController.createList);
router.get('/content/event/:eventId([0-9]+)', [checkJwt], [findEventById], ToDoListController.getAllToDoListsByEventId);

router.route('/content/:id([0-9]+)')
.put([checkJwt], ToDoListController.editList)
.delete([checkJwt], ToDoListController.deleteList);

export default router;

