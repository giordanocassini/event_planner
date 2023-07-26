import { quotationRepository } from './../repositories/quotationRepository';
import { Quotation } from './../entities/Quotation';
import IFactory from '../interfaces/factories/IFactory';
import { Event } from '../entities/Event';

export default class QuotationFactory implements IFactory<Quotation> {
  private static instance: QuotationFactory;

  private constructor() {}

  static getInstance(): QuotationFactory {
    if (!QuotationFactory.instance) {
      QuotationFactory.instance = new QuotationFactory();
    }
    return QuotationFactory.instance;
  }

  createInstance(event: Event, description: string, contact: string, provider: string, expected_expense:number, actual_expense: number, amount_already_paid: number): Quotation {
    try {
      const quotation: Quotation = quotationRepository.create({
        event,
        description,
        contact,
        provider,
        expected_expense,
        actual_expense,
        amount_already_paid,
      });

      return quotation;
    } catch (error) {
      throw new Error('undefined error');
    }
  }
}
