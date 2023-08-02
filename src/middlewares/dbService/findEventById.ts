import { Response, NextFunction } from "express";
import EventRequest from "../../interfaces/express/EventRequest";

const eventDbService: EventDbService = EventDbService.getInstance();


export const findEventById = (req: EventRequest, res: Response, next: NextFunction) => {
    
}