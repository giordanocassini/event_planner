import { toDoListRepository } from './../repositories/toDoListRepository';
import IDbService from '../interfaces/services/IDbService';
import { ToDoList } from '../entities/ToDoList';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import EventDbService from '../services/EventDbService';
import { Event } from '../entities/Event';

const eventDbService: EventDbService = EventDbService.getInstance();

export default class ToDoListDbService implements IDbService<ToDoList> {
  private static instance: ToDoListDbService;

  private constructor() {}
  static getInstance(): ToDoListDbService {
    if (!ToDoListDbService.instance) {
      ToDoListDbService.instance = new ToDoListDbService();
    }
    return ToDoListDbService.instance;
  }

  async findById(id: number): Promise<ToDoList> {
    try {
        const toDoList: ToDoList = await toDoListRepository.findOneOrFail({ where: { id, deleted: false }, relations: ['toDoList'] }); 
        return toDoList;
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new Error(error.message); 
        throw new Error('undefined error'); 
      }
  }
  async deleteById(id: number): Promise<void> {
    try {
        const toDoList: ToDoList = await this.findById(id);
        toDoList.deleted = true;
        const event: Event = await eventDbService.findById(toDoList.event.id);
        event.toDoLists = event.toDoLists.filter((t) => t.id !== toDoList.id);
        this.insert(toDoList);
        eventDbService.insert(event);
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('undefined error');
      }
  }

  async findAllByEventId(eventId: number): Promise<Array<ToDoList>> {
    let allToDoListsByEvent: ToDoList[];
    try {
      allToDoListsByEvent = await toDoListRepository.find({ where: { event: { id: eventId } } });
      return allToDoListsByEvent;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new Error(error.message); 
      throw new Error('undefined error');
    }
  }

  async insert(data: ToDoList): Promise<ToDoList> {
     try {
      await toDoListRepository.save(data);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      if (error instanceof QueryFailedError) throw new Error(error.message);
      throw new Error('undefined error');
    }
    return data;
  }
}
