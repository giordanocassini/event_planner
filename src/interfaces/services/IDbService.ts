export default interface IDbService<T> {
  findById(id: number): Promise<T>;
  deleteById(id: number): Promise<void>;
  insert(data: T): Promise<T>;
}
