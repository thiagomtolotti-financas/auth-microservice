import { Request, Response } from "express";

import routesSchemas from "@/schemas/routesSchemas";

import { WithUserId } from "@/globals";

import handleError from "@/errors/handleError";
import updateUserPassword from "./updateUserPassword";

export default async function change_password(
  req: Request & WithUserId,
  res: Response
) {
  const { success, data } = routesSchemas.change_password.safeParse(req.body);

  if (!success) {
    res.status(400).send("Invalid data");
    return;
  }

  try {
    await updateUserPassword(req.user_id, data.password);

    res.send("Password changed successfully");
  } catch (err) {
    handleError(err as Error, res);
  }
}
