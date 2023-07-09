import { eventRepository } from './../repositories/eventRepository';
import IDbService from '../interfaces/services/IDbService';
import { Event } from '../entities/Event';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export default class EventDbService implements IDbService<Event> {
  private static instance: EventDbService;

  private constructor() {}

  static getInstance(): EventDbService {
    if (!EventDbService.instance) {
      EventDbService.instance = new EventDbService();
    }
    return EventDbService.instance;
  }

  async findById(id: number): Promise<Event> {
    let event: Event;

    try {
      event = await eventRepository.findOneOrFail({ where: { id } }); // check behavior
      return event;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); // check behavior
      throw new Error('undefined error'); // check error
    }
  }

  async deleteById(id: number): Promise<Event> {
    let event: Event;

    try {
      event = await this.findById(id);
      await eventRepository.delete(id);
      return event;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      if (error instanceof QueryFailedError) throw new Error(error.message);
      throw new Error('undefined error');
    }
  }

  async insert(data: Event): Promise<Event> {
    try {
      await eventRepository.save(data);
    } catch (error) {
      throw new Error('undefined error');
    }
    return data;
  }
}
