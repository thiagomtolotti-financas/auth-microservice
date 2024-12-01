import { Request, Response } from "express";
import { z } from "zod";
import passwordSchema from "../schemas/zod/passwordSchema";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";

const EXPIRATION_TIME_IN_SECONDS = 60 * 60 * 12;

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

    //  TODO: Generate access and refresh tokens and return them

    res.send(user);
  } catch (err) {
    // TODO: Handle errors
    res.status(400).send((err as Error).message);
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

  // TODO: Make custom errors
  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("User password not registered");

  const isPasswordRight = await bcrypt.compare(password, user.password);

  if (!isPasswordRight) throw new Error("Invalid email or password");

  return user;
}
