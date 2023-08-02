import { Quotation } from './../entities/Quotation';
import IDbService from '../interfaces/services/IDbService';
import { quotationRepository } from './../repositories/quotationRepository';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export default class QuotationDbService implements IDbService<Quotation> {
  private static instance: QuotationDbService;

  static getInstance(): QuotationDbService {
    if (!QuotationDbService.instance) {
      QuotationDbService.instance = new QuotationDbService();
    }
    return QuotationDbService.instance;
  }

  private constructor() {}

  async findById(id: number): Promise<Quotation> {
    try {
      const quotation: Quotation = await quotationRepository.findOneOrFail({ where: { id } }); // check behavior
      return quotation;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); // check behavior
      throw new Error('undefined error'); // check error
    }
  }

  deleteById(id: number): Promise<Quotation> {
    throw new Error('Method not implemented.');
  }

  async insert(data: Quotation): Promise<Quotation> {
    try {
      await quotationRepository.save(data);
    } catch (error) {
      throw new Error('undefined error');
    }
    return data;
  }

  async listAllExpectedExpense(eventId: number): Promise<Quotation> {
    let quotation: Quotation | undefined;

    try {
      quotation = await quotationRepository
        .createQueryBuilder('quotation')
        .where('quotation.event_id = :event_id', { event_id: eventId })
        .addSelect('SUM(quotation.expected_expense)', 'sum')
        .groupBy('quotation.event_id')
        .getRawOne();
      if (quotation == undefined) throw new Error('Query failed');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('undefined error');
    }
    
    return quotation;
  }
}
