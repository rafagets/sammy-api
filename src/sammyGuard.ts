export interface ISammyGuard<T> {
  execute(): Promise<T>;
}