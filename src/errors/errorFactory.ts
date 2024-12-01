export default function errorFactory(name: string, defaultMessage: string) {
  return class extends Error {
    constructor(message: string = defaultMessage) {
      super(message);

      this.name = name;

      Object.setPrototypeOf(this, new.target.prototype);
    }
  };
}
