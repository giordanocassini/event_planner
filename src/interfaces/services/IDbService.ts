export default interface IDbService<T> {
  findById(id: number): Promise<T>;
  deleteById(id: number): Promise<T>;
  insert(data: T): Promise<T>;
}
