import { Request, Response } from "express";
import { z } from "zod";
import passwordSchema from "../schemas/zod/passwordSchema";
import bcrypt from "bcrypt";
import UserModel, { User } from "../models/UserModel";
import { sign } from "jsonwebtoken";
import errors, {
  InvalidEmailOrPasswordError,
  PasswordNotRegisteredError,
  UserNotFoundError,
} from "../errors";
import EXPIRATION_TIME_IN_SECONDS from "../constants/EXPIRATION_TIME_IN_SECONDS";

export default async function login(req: Request, res: Response) {
  const { success, data } = validateBody(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  const { email, password } = data;

  // TODO: https://www.youtube.com/watch?v=AdmGHwvgaVs
  try {
    const user = await findUser(email, password);

    const tokens = generateTokens(user);

    res.send({ ...tokens, email });
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

function generateTokens(user: User) {
  const access_token = sign({ user_id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: EXPIRATION_TIME_IN_SECONDS,
  });

  const refresh_token = sign({ user_id: user.id }, process.env.JWT_SECRET!);

  return { access_token, refresh_token };
}
