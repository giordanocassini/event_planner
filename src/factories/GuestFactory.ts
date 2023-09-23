import { guestRepository } from './../repositories/guestRepository';
import { Guest } from './../entities/Guest';
import { Event } from './../entities/Event';
import IFactory from '../interfaces/factories/IFactory';

export default class GuestFactory implements IFactory<Guest> {

  private static instance: GuestFactory;

  private constructor() {}

  static getInstance(): GuestFactory {
    if (!GuestFactory.instance) {
      GuestFactory.instance = new GuestFactory();
    }
    return GuestFactory.instance;
  }

  createInstance(name: string, contact: string, invite: boolean, isConfirmed: boolean, event: Event): Guest {
    try {
      const guest: Guest = guestRepository.create({
        name,
        contact,
        invite,
        isConfirmed,
        event,
        deleted: false
      });

      return guest;
    } catch (error) {
      throw new Error('unable to create instance');
    }
  }
}
