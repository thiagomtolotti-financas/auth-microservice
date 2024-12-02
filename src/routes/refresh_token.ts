import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { JWT } from "../globals";
import UserModel from "../models/UserModel";
import { InvalidTokenError, UserNotFoundError } from "../errors";
import EXPIRATION_TIME_IN_SECONDS from "../constants/EXPIRATION_TIME_IN_SECONDS";
import { z } from "zod";
import handleError from "../errors/handleError";

export default async function refresh_token(req: Request, res: Response) {
  const { success, data } = z
    .object({
      refresh_token: z.string(),
    })
    .safeParse(req.body);

  if (!success) {
    res.status(401).send("Invalid Data");
    return;
  }

  try {
    const { user_id } = verify(
      data.refresh_token,
      process.env.JWT_SECRET!
    ) as JWT;

    const user = await UserModel.findById(user_id);

    if (!user) throw new UserNotFoundError();

    if (data.refresh_token !== user.refresh_token) {
      throw new InvalidTokenError();
    }

    const access_token = sign({ user_id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: EXPIRATION_TIME_IN_SECONDS,
    });

    res.send({ access_token });
  } catch (err) {
    handleError(err as Error, res);
  }
}
