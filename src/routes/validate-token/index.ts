import { Request, Response } from "express";

import { UserNotFoundError } from "@/errors";

import { JWT } from "@/globals";

import UserModel from "@/models/UserModel";
import authHeaderSchema from "@/schemas/zod/authHeaderSchema";

import { verify } from "jsonwebtoken";

export default async function validate_token(req: Request, res: Response) {
  const { data, success } = authHeaderSchema.safeParse(
    req.headers.authorization
  );

  if (!success) {
    res.status(401).send("Invalid authorization");
    return;
  }

  const access_token = data.replace("Bearer ", "");

  try {
    const { user_id } = verify(access_token, process.env.JWT_SECRET!) as JWT;

    const user = await UserModel.findById(user_id);

    if (!user) throw new UserNotFoundError();
    if (!user.is_active) {
      res.status(403).send("User is not active");
      return;
    }

    res.send({ user_id });
  } catch (err) {
    console.error(err);
  }
}
