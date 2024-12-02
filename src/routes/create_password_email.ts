import { z } from "zod";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { UserAlreadyExistsError } from "../errors";
import handleError from "../errors/handleError";

export default async function create_password_email(
  req: Request,
  res: Response
) {
  const { success, data } = validateData(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  try {
    const user = await createUser(data.email);

    // TODO: Logic to send the user the email with the code to create the password

    res.send("Email sent successfully");
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

function generateChangePasswordCode() {
  const oneHour = 1000 * 60 * 60;
  const expireTime = Date.now() + oneHour;
  const code = Math.floor(1000 + Math.random() * 9000);

  return { code, expireTime };
}

async function createUser(email: string) {
  const { code, expireTime } = generateChangePasswordCode();

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
