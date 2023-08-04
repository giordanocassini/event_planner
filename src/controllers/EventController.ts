//import { findUsersByEmail } from './../helpers/findUsersByEmail';
import { quotationRepository } from '../repositories/quotationRepository';
import { Event } from './../entities/Event';
import { User } from '../entities/User';
import { Response, Request } from 'express';
import { validate } from 'class-validator';
import EventRequest from '../interfaces/express/EventRequest';
import { formatDate } from '../helpers/formatDate';
import UserDbService from '../services/UserDbService';
import EventDbService from '../services/EventDbService';
import EventFactory from '../factories/EventFactory';
import { Quotation } from '../entities/Quotation';
import QuotationDbService from '../services/QuotationDbService';
import UserRequest from '../interfaces/express/UserRequest';

const userDbService: UserDbService = UserDbService.getInstance();
const eventDbService: EventDbService = EventDbService.getInstance();
const quotationDbService = QuotationDbService.getInstance();
const eventFactory: EventFactory = EventFactory.getInstance();

export class EventController {
  static async createEventbyUser(req: UserRequest, res: Response) {
    let { place, name, date, event_budget, guests_number } = req.body;
    const eventManagers: Array<User> = req.users;
    const loggedUser: User = req.user;

    if (!eventManagers.includes(loggedUser)) eventManagers.push(loggedUser);

    let event_date: Date;
    try {
      event_date = formatDate(date);
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message);
      return res.status(500).send(error);
    }

    const newEvent: Event = eventFactory.createInstance(place, name, event_date, eventManagers, event_budget, guests_number);
    const errors = await validate(newEvent);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await eventDbService.insert(newEvent);
      return res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message);
      return res.status(500).json(error);
    }
  }

  // not documentend on swagger
  static async addUser(req: EventRequest, res: Response) {
    const user: User = req.user; // came from body, not jwt
    const event: Event = req.myEvent;

    if (event.users.includes(user)) return res.status(409).send('User already invited');

    event.users.push(user);

    try {
      await eventDbService.insert(event);
    } catch (error) {
      if (error instanceof Error) return res.status(500).send(error.message);
      return res.status(500).send(error);
    }

    return res.status(201).send('User added to event');
  }

  static async getAllEvents(req: Request, res: Response) {
    let allEvents: Array<Event> = [];
    try {
      allEvents = await eventDbService.listAll();
      return res.status(200).send(allEvents);
    } catch (error) {
      if (error instanceof Error) return res.status(500).send(error.message);
      return res.status(500).send(error);
    }
  }

  static async getEventsByUser(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    let user: User;
    try {
      user = await userDbService.findById(userId);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).send(error);
    }

    let allEventsByUser: Array<Event>;

    try {
      allEventsByUser = await eventDbService.listAllUserEvents(userId);
      return res.status(200).send(allEventsByUser);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).json(error);
    }
  }

  static async editEvent(req: EventRequest, res: Response) {
    const event: Event = req.myEvent;
    const { place, name, date, event_budget, guests_number } = req.body;

    if (date) {
      let dateObject: Date;
      try {
        dateObject = formatDate(date);
        event.date = dateObject;
      } catch (error) {
        if (error instanceof Error) return res.status(404).send(error.message);
        return res.status(500).json(error);
      }
    }
    if (place) {
      event.place = place;
    }
    if (name) {
      event.name = name;
    }
    if (event_budget) {
      event.event_budget = event_budget;
    }
    if (guests_number) {
      event.guests_number = guests_number;
    }

    const errors = await validate(event);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await eventDbService.insert(event);
      return res.status(201).send(event);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).json(error);
    }
  }

  static async deleteEvent(req: EventRequest, res: Response) {
    const event: Event = req.myEvent;

    event.deleted = true;

    try {
      await eventDbService.insert(event);
      return res.status(201).send(event);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).json(error);
    }
  }

  static async listAllExpected_Expense(req: EventRequest, res: Response) {
    let eventId = Number(req.params.eventId);
    let quotation: Quotation;
    try {
      quotation = await quotationDbService.listAllExpectedExpense(eventId);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(400).send(error);
    }

    console.log('🚀 ~ file: EventController.ts:203 ~ EventController ~ listAllExpected_Expense ~ quotation:', quotation);

    // try {
    //   const { quotation_event_id, sum } = quotation;

    //   const expected_sum_event = {
    //     event_id: quotation_event_id,
    //     expected_expense: sum,
    //   };
    //   return res.json(expected_sum_event);
    // } catch (error) {
    //   return res.status(400).send(error);
    // }
  }

  static async listAllExpense(req: EventRequest, res: Response) {
    const eventId = Number(req.params.eventId);

    let quotation: any;

    try {
      quotation = await quotationRepository
        .createQueryBuilder('quotation')
        .where('quotation.event_id=:event_id', { event_id: eventId })
        .addSelect('SUM(quotation.actual_expense)', 'sum')
        .groupBy('quotation.event_id')
        .getRawOne();
    } catch (error) {
      return res.status(400).send(error);
    }

    try {
      const { quotation_event_id, sum } = quotation;

      let actual_sum_event = {
        event_id: quotation_event_id,
        actual_expense: sum,
      };
      return res.json(actual_sum_event);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  static async getEventByIdFromLoggedUser(req: EventRequest, res: Response) {
    const eventId = Number(req.params.eventId);
    let user: User = req.user;
    let eventByUser: Event | undefined;

    try {
      const allEventsbyUser: Array<Event> = await eventDbService.listAllUserEvents(user.id);
      eventByUser = allEventsbyUser.find(event => event.id == eventId);
      if (eventByUser == undefined) throw new Error('Event not found for this user');
      return res.send(eventByUser);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).json(error);
    }
  }
}
