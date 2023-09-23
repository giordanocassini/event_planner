import { guestRepository } from '../repositories/guestRepository';
import { Response, Request } from 'express';
import { validate } from 'class-validator';
import EventRequest from '../interfaces/express/EventRequest';
import { Event } from '../entities/Event';
import { Guest } from '../entities/Guest';
import GuestFactory from '../factories/GuestFactory';
import GuestDbService from '../services/GuestDbService';

const guestFactory: GuestFactory = GuestFactory.getInstance();
const guestDbService: GuestDbService = GuestDbService.getInstance();

export class GuestController {
  static async createGuest(req: EventRequest, res: Response) {
    const { name, contact, invite, isConfirmed } = req.body;
    const event: Event = req.myEvent;

    const guest: Guest = guestFactory.createInstance(name, contact, invite, isConfirmed, event);

    const errors = await validate(guest);
    if (errors.length > 0) return res.status(400).send(errors);

    try {
      await guestDbService.insert(guest);
      return res.status(200).send(guest);
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message);
      return res.status(500).send(error);
    }
  }

  static async editGuest(req: Request, res: Response) {
    const { name, contact, invite, isConfirmed } = req.body;
    const id = Number(req.params.id);

    let guest: Guest;

    try {
      guest = await guestDbService.findById(id);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).send(error);
    }

    if (name) guest.name = name;
    if (contact) guest.contact = contact;
    if (invite) guest.invite = invite;
    if (isConfirmed) guest.isConfirmed = isConfirmed;

    const errors = await validate(guest);
    if (errors.length > 0) return res.status(400).send(errors);

    try {
      await guestDbService.insert(guest);
      return res.status(200).send('Guest updated');
    } catch (error) {
      if (error instanceof Error) return res.status(500).send(error.message);
      return res.status(500).send(error);
    }
  }

  static async getAllGuestByEventId(req: EventRequest, res: Response) {
    const event: Event = req.myEvent;


    const guestsEvent = await guestRepository.find({
      where: {
        event: {
          id: Number(event_id),
        },
      },
    });

    return res.status(200).send(guestsEvent);
  }

  static async deleteGuest(req: Request, res: Response) {
    const { id } = req.params;

    const guestExists = await guestRepository.countBy({ id: Number(id) });

    if (guestExists < 1) return res.status(404).json({ error: 'Guest not found' });

    await guestRepository.delete(id);

    return res.sendStatus(204);
  }
}
