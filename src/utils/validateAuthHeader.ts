import { JWT, WithUserId } from "@/globals";

import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { UserInactiveError, UserNotFoundError } from "@/errors";
import handleError from "@/errors/handleError";

import UserModel from "@/models/UserModel";
import { z } from "zod";

const authHeaderSchema = z
  .string()
  .regex(/^Bearer\s.+$/)
  .transform((header) => header.replace(/^Bearer\s/, "")); // Extract only the token;

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
    const { user_id } = verify(data, process.env.JWT_SECRET!) as JWT;

    const user = await UserModel.findById(user_id);

    if (!user) throw new UserNotFoundError();
    if (!user.is_active) throw new UserInactiveError();

    (req as Request & WithUserId).user_id = user_id;

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
      // Specific handling for JWT errors
      res.status(401).send("Invalid authorization");
    } else {
      // Delegate to your handleError function for other errors
      handleError(err as Error, res, 401);
    }
  }
}
