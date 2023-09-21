import { QuotationController } from './../controllers/QuotationController';
import { Router } from 'express';
import { checkJwt } from '../middlewares/auth/checkJwt';
import { findEventById } from './../middlewares/dbService/findEventById';
import { checkQuotations } from '../middlewares/validations/checkQuotations';

const router = Router();

router.route('/quotation/:eventId([0-9]+)')
.post([checkJwt], [findEventById], QuotationController.createQuotation)

router.route('/quotation/:id([0-9]+)')
.get([checkJwt], QuotationController.getQuotationById)
.put([checkJwt], QuotationController.editQuotation)
.delete([checkJwt], QuotationController.deleteQuotation);

router.route('/quotation/event/:eventId([0-9]+)').get([checkJwt], [findEventById], [checkQuotations], QuotationController.getAllQuotationByEventId);

export default router;
