export class AlreadyExistEmailError extends Error {
  constructor() {
    super("Already exist e-mail");
  }
}
