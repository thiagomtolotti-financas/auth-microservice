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

export const InvalidCodeError = errorFactory(
  "InvalidCodeError",
  "Invalid code"
);

export const ExpiredCodeError = errorFactory(
  "ExpiredCodeError",
  "Expired code"
);

export const UserAlreadyExistsError = errorFactory(
  "UserAlreadyExistsError",
  "An user with this email is already registered"
);

const errors = [
  UserNotFoundError,
  PasswordNotRegisteredError,
  InvalidEmailOrPasswordError,
  InvalidCodeError,
  ExpiredCodeError,
  UserAlreadyExistsError,
];

export default errors;
