import { GuestController } from "../controllers/GuestController";
import { Router } from "express";
import { checkJwt } from "../middlewares/auth/checkJwt";
import { findEventById } from "../middlewares/dbService/findEventById";

const router = Router();

router.post("/guest/:eventId([0-9]+)", [checkJwt], [findEventById], GuestController.createGuest);
router.get("/guest/event/:eventId([0-9]+)",[checkJwt], [findEventById], GuestController.getAllGuestsByEventId);

router
  .route("/guest/:id([0-9]+)")
  .put([checkJwt], GuestController.editGuest)
  .delete([checkJwt], GuestController.deleteGuest);

export default router;
