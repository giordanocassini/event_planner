export default interface IFactory<T>{
    createInstance(...args: any[]): T ;
}