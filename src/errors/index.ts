import errorFactory from "./errorFactory";

export const UserNotFoundError = errorFactory(
  "UserNotFoundError",
  "User not found"
);

export const PasswordNotRegisteredError = errorFactory(
  "PasswordNotRegisteredError",
  "User password not registered yet"
);

export const InvalidEmailOrPasswordError = errorFactory(
  "InvalidEmailOrPasswordError",
  "Invalid email or password"
);

const errors = [
  UserNotFoundError,
  PasswordNotRegisteredError,
  InvalidEmailOrPasswordError,
];

export default errors;
