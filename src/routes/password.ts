import { Request, Response } from "express";
import { z } from "zod";
import passwordSchema from "../schemas/zod/passwordSchema";
import UserModel, { User } from "../models/UserModel";
import {
  ExpiredCodeError,
  InvalidCodeError,
  UserNotFoundError,
} from "../errors";
import handleError from "../errors/handleError";

export default async function password(req: Request, res: Response) {
  const { success, data } = validateData(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  const { email, code, password } = data;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) throw new UserNotFoundError();

    validateCode(user, code);

    await user.updateOne({
      password_code: null,
      password_code_expire_time: null,
      password,
    });

    res.send("Password set successfully");
  } catch (err) {
    handleError(err as Error, res);
  }
}

function validateData(body: unknown) {
  // TODO: Make regex to validate code
  const bodySchema = z
    .object({
      code: z.string(),
      password: passwordSchema,
      email: z.string().email(),
    })
    .strict();

  return bodySchema.safeParse(body);
}

function validateCode(user: User, code: string) {
  const codeExpireTime = user.password_code_expire_time;

  if (user.password_code !== code) throw new InvalidCodeError();

  if (!codeExpireTime || Date.now() > codeExpireTime.getTime()) {
    throw new ExpiredCodeError();
  }
}
