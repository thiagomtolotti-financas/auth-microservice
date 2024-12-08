import { Request, Response } from "express";

import UserModel from "@/models/UserModel";

import { UserNotFoundError } from "@/errors";
import handleError from "@/errors/handleError";

import validateCode from "./validateCode";
import passwordRouteSchema from "@/schemas/zod/passwordRouteSchema";

export default async function password(req: Request, res: Response) {
  const { success, data } = passwordRouteSchema.safeParse(req.body);

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
