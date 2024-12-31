import { JWT, WithUserId } from "@/globals";

import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { UserInactiveError, UserNotFoundError } from "@/errors";
import handleError from "@/errors/handleError";

import authHeaderSchema from "@/schemas/zod/authHeaderSchema";
import UserModel from "@/models/UserModel";

export default async function validateAuthHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { success, data } = authHeaderSchema.safeParse(
    req.headers.authorization
  );

  if (!success) {
    res.status(401).send("Invalid authorization");
    return;
  }

  try {
    // TODO: Handle errors from verify
    const { user_id } = jwt.verify(data, process.env.JWT_SECRET!) as JWT;

    const user = await UserModel.findById(user_id);

    if (!user) throw new UserNotFoundError();
    if (!user.is_active) throw new UserInactiveError();

    (req as Request & WithUserId).user_id = user_id;

    next();
  } catch (err) {
    handleError(err as Error, res, 401);
  }
}
