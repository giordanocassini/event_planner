import { QuotationController } from "./../controllers/QuotationController";
import { Router } from "express";
import { checkJwt } from "../middlewares/auth/checkJwt";
import { findEventById } from './../middlewares/dbService/findEventById';

const router = Router();

router.route("/quotation/:eventId([0-9]+)").post([checkJwt], [findEventById], QuotationController.createQuotation);

router
  .route("/quotation/:id([0-9]+)")
  .get([checkJwt],QuotationController.getQuotationById)
  .put([checkJwt],QuotationController.editQuotation)
  .delete([checkJwt],QuotationController.deleteQuotation);

router
  .route("/quotation/event/:id([0-9]+)")
  .get([checkJwt],QuotationController.getAllQuotationByEventId);

export default router;
