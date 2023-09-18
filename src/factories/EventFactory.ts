import { eventRepository } from './../repositories/eventRepository';
import { Event } from './../entities/Event';
import IFactory from '../interfaces/factories/IFactory';
import { User } from '../entities/User';

export default class EventFactory implements IFactory<Event> {

  private static instance: EventFactory;

  private constructor() {}

  static getInstance(): EventFactory {
    if (!EventFactory.instance) {
      EventFactory.instance = new EventFactory();
    }
    return EventFactory.instance;
  }

  createInstance(place: string, name: string, date: Date, users: User[], event_budget: number, guests_number: number): Event {
    try {
      const event: Event = eventRepository.create({
        place,
        name,
        date,
        users,
        event_budget,
        guests_number,
        deleted: false
      });

      return event;
    } catch (error) {
      throw new Error('unable to create instance');
    }
  }
}
