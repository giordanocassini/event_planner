import { Quotation } from './../entities/Quotation';
import IDbService from '../interfaces/services/IDbService';
import { quotationRepository } from './../repositories/quotationRepository';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import EventDbService from './EventDbService';
import { Event } from '../entities/Event';

const eventDbService: EventDbService = EventDbService.getInstance();

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
      const quotation: Quotation = await quotationRepository.findOneOrFail({ where: { id, deleted: false }, relations: ['event'] }); // check behavior
      return quotation;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); // check behavior
      throw new Error('undefined error'); // check error
    }
  }

  async deleteById(id: number): Promise<void> { 
    try {
      const quotation: Quotation = await this.findById(id);
      quotation.deleted = true;      
      const event: Event = await eventDbService.findById(quotation.event.id);
      event.quotations = event.quotations.filter((q) => q.id !== quotation.id);
      this.insert(quotation);
      eventDbService.insert(event);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('undefined error');
    }
  }

  async insert(data: Quotation): Promise<Quotation> {
    try {
      await quotationRepository.save(data);
    } catch (error) {
      throw new Error('unable to store data on database');
    }
    return data;
  }
}
