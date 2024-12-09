import { verify } from "jsonwebtoken";

import { JWT } from "@/globals";
import { InvalidTokenError, UserNotFoundError } from "@/errors";

import UserModel from "@/models/UserModel";

export default async function findUserByRefreshToken(refresh_token: string) {
  const { user_id } = verify(refresh_token, process.env.JWT_SECRET!) as JWT;

  const user = await UserModel.findById(user_id);

  if (!user) throw new UserNotFoundError();

  if (refresh_token !== user.refresh_token) {
    throw new InvalidTokenError();
  }

  return user;
}
