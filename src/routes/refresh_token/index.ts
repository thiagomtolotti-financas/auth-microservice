import { Request, Response } from "express";

import EXPIRATION_TIME_IN_SECONDS from "@/constants/EXPIRATION_TIME_IN_SECONDS";

import handleError from "@/errors/handleError";
import findUserByRefreshToken from "./findUserByRefreshToken";

import { sign } from "jsonwebtoken";
import refreshTokenSchema from "@/schemas/zod/refreshTokenSchema";

export default async function refresh_token(req: Request, res: Response) {
  const { success, data } = refreshTokenSchema.safeParse(req.body);

  if (!success) {
    res.status(401).send("Invalid Data");
    return;
  }

  try {
    const user = await findUserByRefreshToken(data.refresh_token);

    const access_token = sign({ user_id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: EXPIRATION_TIME_IN_SECONDS,
    });

    res.send({ access_token });
  } catch (err) {
    handleError(err as Error, res);
  }
}
