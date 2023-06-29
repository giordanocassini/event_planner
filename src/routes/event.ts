import { checkJwt } from "../middlewares/auth/checkJwt";
import { EventController } from "./../controllers/EventController";
import { Router } from "express";

const router = Router();

router.route("/event").get([checkJwt], EventController.getAllEvents);

router.get(
  "/event/:idUser([0-9]+)",
  [checkJwt],
  EventController.getEventbyIdUser
);

router.get(
  "/event/getevent/:idEvent([0-9]+)",
  [checkJwt],
  EventController.getEventbyIdUserandbyIdEvent
);

router.route("/event").post([checkJwt], EventController.createEventbyUser);

router
  .route("/event/:id([0-9]+)")
  .put([checkJwt], EventController.editEvent)
  .delete([checkJwt], EventController.deleteEvent);

router.get(
  "/event/allExpectedExpense/:id([0-9]+)",
  [checkJwt],
  EventController.listAllExpected_Expense
);
router.get(
  "/event/allActualExpense/:id([0-9]+)",
  [checkJwt],
  EventController.listAllExpense
);
router.put(
  "/event/addUser/:id([0-9]+)",
  [checkJwt],
  EventController.putAddUserinEvent
);

export default router;
