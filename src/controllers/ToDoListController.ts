import { eventRepository } from '../repositories/eventRepository';
import { Response, Request } from 'express';
import { validate } from 'class-validator';
import EventRequest from '../interfaces/express/EventRequest';
import ToDoListDbService from '../services/ToDoListDbService';
import ToDoListFactory from '../factories/ToDoListFactory';
import { ToDoList } from '../entities/ToDoList';
import { Event } from '../entities/Event';

const toDoListDbService: ToDoListDbService = ToDoListDbService.getInstance();
const toDoListFactory: ToDoListFactory = ToDoListFactory.getInstance();

export class ToDoListController {
  static async createList(req: EventRequest, res: Response) {
    const event = req.myEvent;
    const { content, done } = req.body;
    let toDoList: ToDoList;
    try {
      toDoList = toDoListFactory.createInstance(content, done, event);
    } catch (error) {
      if (error instanceof Error) return res.status(500).send(error.message);
      return res.status(500).send(error);
    }

    const errors = await validate(toDoList);
    if (errors.length > 0) return res.status(400).send(errors);

    try {
      await toDoListDbService.insert(toDoList);
      return res.status(201).json(toDoList);
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message);
      return res.status(500).json(error);
    }
  }

  static async editList(req: Request, res: Response) {
    const { content, done } = req.body;
    const id = Number(req.params.id);

    let toDoList: ToDoList;

    try {
      toDoList = await toDoListDbService.findById(id);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).send(error);
    }

    if (content) toDoList.content = content;
    if (done) toDoList.done = done;

    const errors = await validate(toDoList);
    if (errors.length > 0) return res.status(400).send(errors);

    try {
      await toDoListDbService.insert(toDoList);
      return res.status(200).send('toDoList updated');
    } catch (error) {
      if (error instanceof Error) return res.status(500).send(error.message);
      return res.status(500).send(error);
    }
  }

  static async deleteList(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
      await toDoListDbService.deleteById(id);
      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof Error) return res.status(404).send(error.message);
      return res.status(500).send(error);
    }
  }

  static async getAllToDoListsByEventId(req: EventRequest, res: Response) {
    const event: Event = req.myEvent;
    try {
      const allToDoListsByEvent: ToDoList[] = await toDoListDbService.findAllByEventId(event.id);
      return res.status(200).send(allToDoListsByEvent);
    } catch (error) {
      if (error instanceof Error) return res.status(500).send(error.message);
      return res.status(500).send(error);
    }
  }
}
