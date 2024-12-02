import { Request, Response } from "express";
import { z } from "zod";
import passwordSchema from "../schemas/zod/passwordSchema";
import bcrypt from "bcrypt";
import UserModel, { User } from "../models/UserModel";
import { sign } from "jsonwebtoken";
import {
  InvalidEmailOrPasswordError,
  PasswordNotRegisteredError,
  UserNotFoundError,
} from "../errors";
import EXPIRATION_TIME_IN_SECONDS from "../constants/EXPIRATION_TIME_IN_SECONDS";
import catchError from "../errors/handleError";

export default async function login(req: Request, res: Response) {
  const { success, data } = validateBody(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  const { email, password } = data;

  try {
    const user = await findUser(email, password);

    const tokens = await generateTokens(user);

    res.send({ ...tokens, email });
  } catch (err) {
    catchError(err as Error, res);
  }
}

function validateBody(body: unknown) {
  const bodySchema = z
    .object({
      email: z.string().email(),
      password: passwordSchema,
    })
    .strict();

  return bodySchema.safeParse(body);
}

async function findUser(email: string, password: string) {
  const user = await UserModel.findOne({ email });

  if (!user) throw new UserNotFoundError();
  if (!user.password) throw new PasswordNotRegisteredError();

  const isPasswordRight = await bcrypt.compare(password, user.password);

  if (!isPasswordRight) throw new InvalidEmailOrPasswordError();

  return user;
}

async function generateTokens(user: User) {
  const access_token = sign({ user_id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: EXPIRATION_TIME_IN_SECONDS,
  });

  const refresh_token = sign({ user_id: user.id }, process.env.JWT_SECRET!);

  await user.updateOne({
    refresh_token,
  });

  return { access_token, refresh_token };
}
