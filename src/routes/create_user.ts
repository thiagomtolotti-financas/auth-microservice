import { z } from "zod";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { UserAlreadyExistsError } from "../errors";
import handleError from "../errors/handleError";
import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import generatePasswordCode from "../utils/generatePasswordCode";

// TODO: What happens if the password_code is expired?

export default async function create_user(req: Request, res: Response) {
  const { success, data } = validateData(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  try {
    const user = await createUser(data.email);

    const message: MailDataRequired = {
      from: "thiagotolotti@thiagotolotti.com",
      to: user.email,
      subject: "Sua conta foi criada!",
      text: `Sua conta foi criada, para validar basta inserir o código ${user.password_code}`,
    };

    await sendgrid.send(message);

    res.send("An email with the code for creating the password was sent!");
  } catch (err) {
    handleError(err as Error, res);
  }
}

function validateData(body: unknown) {
  const emailSchema = z
    .object({
      email: z.string().email(),
    })
    .strict();

  return emailSchema.safeParse(body);
}

function isMongooseError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error;
}

async function createUser(email: string) {
  const { code, expireTime } = generatePasswordCode();

  try {
    const user = await UserModel.create({
      email,
      password_code: code,
      password_code_expire_time: expireTime,
    });

    await user.save();

    return user;
  } catch (err) {
    if (isMongooseError(err) && err.code === 11000) {
      throw new UserAlreadyExistsError();
    }

    throw err;
  }
}
