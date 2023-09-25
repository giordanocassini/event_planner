import { toDoListRepository } from './../repositories/toDoListRepository';
import { Event } from './../entities/Event';
import IFactory from '../interfaces/factories/IFactory';
import { User } from '../entities/User';
import { ToDoList } from '../entities/ToDoList';

export default class ToDoListFactory implements IFactory<ToDoList> {
  private static instance: ToDoListFactory;

  private constructor() {}

  static getInstance(): ToDoListFactory {
    if (!ToDoListFactory.instance) {
      ToDoListFactory.instance = new ToDoListFactory();
    }
    return ToDoListFactory.instance;
  }

  createInstance(content: string, done: boolean, event: Event): ToDoList {
    try {
      const toDoList: ToDoList = toDoListRepository.create({
        content,
        done,
        event,
      });

      return toDoList;
    } catch (error) {
      throw new Error('unable to create instance');
    }
  }
}
