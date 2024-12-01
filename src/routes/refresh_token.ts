import { Request, Response } from "express";
import authHeaderSchema from "../schemas/zod/authHeaderSchema";
import { sign, verify } from "jsonwebtoken";
import { JWT } from "../globals";
import UserModel from "../models/UserModel";
import errors, { UserNotFoundError } from "../errors";
import EXPIRATION_TIME_IN_SECONDS from "../constants/EXPIRATION_TIME_IN_SECONDS";
import { z } from "zod";

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

    const access_token = sign({ user_id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: EXPIRATION_TIME_IN_SECONDS,
    });

    res.send({ access_token });
  } catch (err) {
    const error = errors.find((e) => err instanceof e);

    if (error) {
      res.status(400).send((err as Error).message);
      return;
    }

    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
