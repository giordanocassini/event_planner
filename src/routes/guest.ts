import { GuestController } from "../controllers/GuestController";
import { Router } from "express";
import { checkJwt } from "../middlewares/auth/checkJwt";

const router = Router();

router.post("/guest/:event_id([0-9]+)", [checkJwt], GuestController.createGuest);
router.get("/guest/event/:event_id([0-9]+)",[checkJwt],GuestController.getAllGuestByEventId);

router
  .route("/guest/:id([0-9]+)")
  .put([checkJwt], GuestController.editGuest)
  .delete([checkJwt], GuestController.deleteGuest);

export default router;
