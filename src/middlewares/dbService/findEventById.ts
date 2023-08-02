import { Response, NextFunction } from 'express';
import EventRequest from '../../interfaces/express/EventRequest';
import EventDbService from '../../services/EventDbService';
import { Event } from '../../entities/Event';

const eventDbService: EventDbService = EventDbService.getInstance();

export const findEventById = async (req: EventRequest, res: Response, next: NextFunction) => {
  const eventId = Number(req.params.eventId);

  let event: Event;

  try {
    event = await eventDbService.findById(eventId);
  } catch (error) {
    if (error instanceof Error) return res.status(400).send(error.message);
    return res.status(500).send(error);
  }

  req.myEvent = event;

  next();
};
