import { userRepository } from './../repositories/userRepository';
import { eventRepository } from '../repositories/eventRepository';
import { quotationRepository } from '../repositories/quotationRepository';
import { Event } from './../entities/Event';
import { User } from '../entities/User';
import { Response, Request } from 'express';
import { validate } from 'class-validator';
import { EntityNotFoundError } from 'typeorm';
import jwt from 'jsonwebtoken';
import UserRequest from '../interfaces/express/UserRequest';
import { formatDate } from '../helpers/formatDate';
import UserDbService from '../services/UserDbService';
import EventDbService from '../services/EventDbService';
import EventFactory from '../factories/EventFactory';

const userDbService: UserDbService = UserDbService.getInstance();
const eventDbService: EventDbService = EventDbService.getInstance();
const eventFactory: EventFactory = EventFactory.getInstance();

export class EventController {
  static async createEventbyUser(req: UserRequest, res: Response) {
    let { place, name, date, event_budget, guests_number } = req.body;

    const loggedUser: User = req.user;
    const managers: User[] = req.users;
    managers.push(loggedUser);

    let event_date: Date;
    try {
      event_date = formatDate(date);
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message);
      return res.status(500).send(error);
    }
    const newEvent = eventFactory.createInstance(place, name, event_date, managers, event_budget, guests_number);
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

  static async putAddUserinEvent(req: Request, res: Response) {
    let { email } = req.body;
    let { id } = req.params;

    let user = await userRepository.findOneBy({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user);
    let event = await eventRepository.findOne({
      where: { id: +id },
      relations: {
        users: true,
      },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.deleted == true) return res.status(404).json({ message: 'Event not found' });
    if (event.users.includes(user)) return res.status(409).json({ message: 'User already invited' });

    if (user) {
      event.users.push(user);
    }

    try {
      await eventRepository.save(event);
    } catch (error) {
      return res.status(500).json(error);
    }
    return res.status(201).send('User added');
  }

  static async getAllEvents(req: Request, res: Response) {
    let allEvents: Array<Event> = [];
    try {
      allEvents = await eventRepository.find({ where: { deleted: false } });
    } catch (error) {
      console.log(error);
      return res.status(500).send('Internal Server Error');
    }

    return res.status(200).send(allEvents);
  }

  static async getEventbyIdUser(req: Request, res: Response) {
    const { idUser } = req.params;
    let user: User;

    try {
      user = await userRepository.findOneOrFail({
        where: { id: Number(idUser) },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).send('User not found');
      }
      return res.status(500).json(error);
    }

    let allEventsbyUser: Array<Event>;
    try {
      allEventsbyUser = await eventRepository.find({
        where: { users: { id: Number(idUser) }, deleted: false },
      });
    } catch (error) {
      return res.status(500).json(error);
    }

    return res.send(allEventsbyUser);
  }

  static async editEvent(req: Request, res: Response) {
    const id = req.params.id;

    let { place, name, date, event_budget, guests_number } = req.body;

    let new_date;
    try {
      let splitDate = date.split('/');
      splitDate.reverse().join('/');
      new_date = new Date(splitDate);
    } catch (error) {
      return res.status(400).send('Invalid Date Format');
    }

    let event: Event;
    try {
      event = await eventRepository.findOneOrFail({
        where: { id: Number(id), deleted: false },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).send('User not found');
      }
      return res.status(500).json(error);
    }

    if (place) {
      event.place = place;
    }
    if (name) {
      event.name = name;
    }
    if (date) {
      event.date = new_date;
    }
    if (event_budget) {
      console.log(event_budget);
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
      await eventRepository.save(event);
    } catch (error) {
      return res.status(500).json(error);
    }

    return res.status(204).send();
  }

  static async deleteEvent(req: Request, res: Response) {
    const id = req.params.id;
    let event: Event;
    try {
      event = await eventRepository.findOneOrFail({
        where: { id: Number(id), deleted: false },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).send('User not found');
      }
      return res.status(500).json(error);
    }

    try {
      event.deleted = true;
      console.log(event);
      await eventRepository.save(event);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(400).json(error.message);
      }
      return res.status(500).json(error);
    }

    return res.status(204).send();
  }

  static async listAllExpected_Expense(req: Request, res: Response) {
    let id = req.params.id;

    let quotation: any;

    try {
      quotation = await quotationRepository
        .createQueryBuilder('quotation')
        .where('quotation.event_id = :event_id', { event_id: id })
        .addSelect('SUM(quotation.expected_expense)', 'sum')
        .groupBy('quotation.event_id')
        .getRawOne();
    } catch (error) {
      return res.status(400).send(error);
    }

    try {
      const { quotation_event_id, sum } = quotation;

      let expected_sum_event = {
        event_id: quotation_event_id,
        expected_expense: sum,
      };
      return res.json(expected_sum_event);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  static async listAllExpense(req: Request, res: Response) {
    const id = req.params.id;

    let quotation: any;

    try {
      quotation = await quotationRepository
        .createQueryBuilder('quotation')
        .where('quotation.event_id=:event_id', { event_id: id })
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

  static async getEventbyIdUserandbyIdEvent(req: Request, res: Response) {
    const token = <any>req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send('Not logged.');
    }

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).end();
      }
      return res.status(400).end();
    }

    const { id }: any = payload;

    const idEvent = req.params.idEvent;
    let user: User;

    try {
      user = await userRepository.findOneOrFail({
        where: { id: Number(id) },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).send('User not found');
      }
      return res.status(500).json(error);
    }

    let allEventsbyUser: Array<Event>;
    let eventbyUser;
    try {
      allEventsbyUser = await eventRepository.find({
        where: { id: Number(idEvent), users: { id: Number(id) }, deleted: false },
      });
      eventbyUser = allEventsbyUser[0];
    } catch (error) {
      return res.status(500).json(error);
    }

    return res.send(eventbyUser);
  }
}
