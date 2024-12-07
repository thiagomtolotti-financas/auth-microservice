import { z } from "zod";
import { Request, Response } from "express";
import authHeaderSchema from "../schemas/zod/authHeaderSchema";
import passwordSchema from "../schemas/zod/passwordSchema";
import UserModel from "../models/UserModel";
import { UserNotFoundError } from "../errors";
import { verify } from "jsonwebtoken";
import { JWT } from "../globals";
import handleError from "../errors/handleError";

export default function change_password(req: Request, res: Response) {
  const { success: authHeaderSuccess, data: authHeader } =
    authHeaderSchema.safeParse(req.headers.authorization);

  const { success, data } = validateData(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  if (!authHeaderSuccess) {
    res.status(401).send("Invalid authentication");
    return;
  }

  try {
    const { user_id } = verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET!
    ) as JWT;
    changePasswordService(user_id, data.password);
    res.send("Password changed successfully");
  } catch (err) {
    handleError(err as Error, res);
  }
}

function validateData(body: unknown) {
  const bodySchema = z
    .object({
      password: passwordSchema,
    })
    .strict();

  return bodySchema.safeParse(body);
}

async function changePasswordService(user_id: string, new_password: string) {
  const user = await UserModel.findById(user_id);

  if (!user) throw new UserNotFoundError();

  await user.updateOne({
    password: new_password,
  });
}
