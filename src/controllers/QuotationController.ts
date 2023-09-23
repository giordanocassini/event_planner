import { Quotation } from './../entities/Quotation';
import { Event } from '../entities/Event';
import QuotationDbService from '../services/QuotationDbService';
import QuotationFactory from '../factories/QuotationFactory';
import { Response, Request } from 'express';
import EventRequest from '../interfaces/express/EventRequest';
import { validate } from 'class-validator';

const quotationDbService = QuotationDbService.getInstance();
const quotationFactory = QuotationFactory.getInstance();

export class QuotationController {
  static async createQuotation(req: EventRequest, res: Response) {
    const { description, contact, provider, expected_expense, actual_expense, amount_already_paid } = req.body;

    const event: Event = req.myEvent;

    const newQuotation = quotationFactory.createInstance(event, description, contact, provider, expected_expense, actual_expense, amount_already_paid);

    try {
      const quotation = await quotationDbService.insert(newQuotation);
      return res.status(201).send(quotation);
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message);
      return res.status(500).send(error);
    }
  }

  static async getQuotationById(req: Request, res: Response) {
    const quotationId = Number(req.params.id);
    try {
      const quotation = await quotationDbService.findById(quotationId);
      return res.status(200).send(quotation);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).send(error);
    }
  }

  static async editQuotation(req: Request, res: Response) {
    const quotationId = Number(req.params.id);
    const { description, contact, provider, expected_expense, actual_expense, amount_already_paid } = req.body;

    let quotation: Quotation;

    try {
      quotation = await quotationDbService.findById(quotationId);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).send(error);
    }

    if (description) quotation.description = description;
    if (contact) quotation.contact = contact;
    if (provider) quotation.provider = provider;
    if (expected_expense) quotation.expected_expense = expected_expense;
    if (actual_expense) quotation.actual_expense = actual_expense;
    if (amount_already_paid) quotation.amount_already_paid = amount_already_paid;

    const errors = await validate(quotation);
    if (errors.length > 0) return res.status(400).send(errors);

    try {
      await quotationDbService.insert(quotation);
      return res.status(200).send('Quotation updated');
    } catch (error) {
      if (error instanceof Error) return res.status(500).send(error.message);
      return res.status(500).send(error);
    }
  }

  static async getAllQuotationByEventId(req: EventRequest, res: Response) {
    return res.status(200).send(req.myEvent.quotations); //not sure if this respects REST API's etiquete
  }

  static async deleteQuotation(req: Request, res: Response) {
    const quotationId = Number(req.params.id);

    try {
      await quotationDbService.deleteById(quotationId);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).send(error);
    }
  }
}
