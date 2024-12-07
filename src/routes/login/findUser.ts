import {
  InvalidEmailOrPasswordError,
  PasswordNotRegisteredError,
  UserNotFoundError,
} from "@/errors";
import UserModel from "@/models/UserModel";

import bcrypt from "bcrypt";

export default async function findUser(email: string, password: string) {
  const user = await UserModel.findOne({ email });

  if (!user) throw new UserNotFoundError();
  if (!user.password) throw new PasswordNotRegisteredError();

  const isPasswordRight = await bcrypt.compare(password, user.password);

  if (!isPasswordRight) throw new InvalidEmailOrPasswordError();

  return user;
}
