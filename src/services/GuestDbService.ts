import { guestRepository } from './../repositories/guestRepository';
import { Guest } from './../entities/Guest';
import IDbService from '../interfaces/services/IDbService';
import { EntityNotFoundError } from 'typeorm';
import EventDbService from '../services/EventDbService';
import { Event } from '../entities/Event';

const eventDbService: EventDbService = EventDbService.getInstance();

export default class GuestDbService implements IDbService<Guest> {
  private static instance: GuestDbService;

  static getInstance(): GuestDbService {
    if (!GuestDbService.instance) {
      GuestDbService.instance = new GuestDbService();
    }
    return GuestDbService.instance;
  }

  private constructor() {}

  async findById(id: number): Promise<Guest> {
    try {
      const guest: Guest = await guestRepository.findOneOrFail({ where: { id, deleted: false }, relations: ['event'] }); 
      return guest;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); 
      throw new Error('undefined error'); 
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      const guest: Guest = await this.findById(id);
      guest.deleted = true;
      const event: Event = await eventDbService.findById(guest.event.id);
      event.guests = event.guests.filter((g) => g.id !== guest.id);
      this.insert(guest);
      eventDbService.insert(event);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('undefined error');
    }
  }

  async insert(data: Guest): Promise<Guest> {
    try {
      await guestRepository.save(data);
    } catch (error) {
      throw new Error('unable to store data on database');
    }
    return data;
  }

  async findAllByEventId(eventId: number): Promise<Array<Guest>> {
    let allGuestsByEvent: Guest[];
    try {
      allGuestsByEvent = await guestRepository.find({ where: { event: { id: eventId } } });
      return allGuestsByEvent;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); 
      throw new Error('undefined error');
    }
  }
}
