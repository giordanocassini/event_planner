import { findEventById } from './../middlewares/dbService/findEventById';
import { findUsersByEmail } from './../middlewares/dbService/findUsersByEmail';
import { checkJwt } from '../middlewares/auth/checkJwt';
import { getUserFromJwt } from '../middlewares/dbService/getUserFromJwt';
import { EventController } from './../controllers/EventController';
import { Router } from 'express';
import { findUserByEmail } from '../middlewares/dbService/findUserByEmail';

const router = Router();

router.route('/event')
.get([checkJwt], EventController.getAllEvents)
.post([checkJwt], [getUserFromJwt], [findUsersByEmail], EventController.createEventbyUser);

router.route('/event/:eventId([0-9]+)')
.put([checkJwt], [findEventById], EventController.editEvent)
.delete([checkJwt], [findEventById], EventController.deleteEvent)
.get([checkJwt], [getUserFromJwt], EventController.getEventByIdFromLoggedUser); //doesn't make sense logged user being a parameter on this

router.get('/event/allExpectedExpense/:eventId([0-9]+)', [checkJwt], [findEventById], EventController.listAllExpected_Expense);
router.get('/event/allActualExpense/:eventId([0-9]+)', [checkJwt], [findEventById], EventController.listAllExpense);
router.get('/event/byUser/:userId([0-9]+)', [checkJwt], EventController.getEventsByUser);
router.put('/event/addUser/:eventId([0-9]+)', [checkJwt], [findUserByEmail], [findEventById], EventController.addUser);


export default router;
