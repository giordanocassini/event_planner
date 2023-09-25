import { ToDoList } from '../entities/ToDoList';
import { AppDataSource } from "../datasource";

export const toDoListRepository = AppDataSource.getRepository(ToDoList);