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
      event = await eventRepository.findOneOrFail({ where: { id, deleted: false }, relations: ['users', 'quotations', 'todolist', 'guests']  }); // check behavior
      return event;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); // check behavior
      throw new Error('undefined error'); // check error
    }
  }

  async listAll(): Promise<Array<Event>> {
    let allEvents: Array<Event> = [];
    try {
      allEvents = await eventRepository.find({ where: { deleted: false }, relations: ['users'] });
      return allEvents;
    } catch (error) {
      throw new Error('undefined error');
    }
  }
  async listAllUserEvents(userId: number): Promise<Array<Event>> {
    let allUserEvents: Array<Event>;

    try {
      allUserEvents = await eventRepository.find({
        where: { users: { id: userId }, deleted: false },
      });
      return allUserEvents;
    } catch (error) {
      throw new Error('undefined error');
    }
  }

  async deleteById(id: number): Promise<void> {
    let event: Event;

    try {
      event = await this.findById(id);
      await eventRepository.delete(id);
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
      if (error instanceof Error) throw new Error(error.message);
      if (error instanceof QueryFailedError) throw new Error(error.message);
      throw new Error('undefined error');
    }
    return data;
  }
}
