import { Request, Response, NextFunction } from 'express';
import EventRequest from '../../interfaces/express/EventRequest';
import { Event } from '../../entities/Event';

export const checkQuotations = (req: EventRequest, res: Response, next: NextFunction) => {
  const event: Event = req.myEvent;

  console.log(event.quotations);
  
  if (!(event.quotations.length > 0)) return res.status(404).send('No quotations yet for this event');

  next();
};
