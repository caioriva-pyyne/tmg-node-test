export class EmptyStackError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EmptyStackError.prototype);
  }
}
