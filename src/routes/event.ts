import { findUsersByEmail } from './../middlewares/dbService/findUsersByEmail';
import { checkJwt } from '../middlewares/auth/checkJwt';
import { getUserFromJwt } from '../middlewares/dbService/getUserFromJwt';
import { EventController } from './../controllers/EventController';
import { Router } from 'express';
import { findUserByEmail } from '../middlewares/dbService/findUserByEmail';

const router = Router();

router.route('/event')
.get([checkJwt], EventController.getAllEvents)
.post([checkJwt], [getUserFromJwt], EventController.createEventbyUser);

router.route('/event/:id([0-9]+)')
.put([checkJwt], EventController.editEvent)
.delete([checkJwt], EventController.deleteEvent);

router.get('/event/:userId([0-9]+)', [checkJwt], EventController.getEventsByUser);
router.get('/event/getevent/:idEvent([0-9]+)', [checkJwt], [getUserFromJwt], EventController.getEventbyLoggedUserAndByEventId);
router.get('/event/allExpectedExpense/:id([0-9]+)', [checkJwt], EventController.listAllExpected_Expense);
router.get('/event/allActualExpense/:id([0-9]+)', [checkJwt], EventController.listAllExpense);
router.put('/event/addUser/:id([0-9]+)', [checkJwt], [findUserByEmail], EventController.addUser);

export default router;
