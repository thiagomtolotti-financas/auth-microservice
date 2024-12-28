import { Request, Response } from "express";

import authHeaderSchema from "@/schemas/zod/authHeaderSchema";
import routesSchemas from "@/schemas/routesSchemas";

import jwt from "jsonwebtoken";
import { JWT } from "@/globals";

import handleError from "@/errors/handleError";
import updateUserPassword from "./updateUserPassword";

export default async function change_password(req: Request, res: Response) {
  const { success: authHeaderSuccess, data: authHeader } =
    authHeaderSchema.safeParse(req.headers.authorization);

  const { success, data } = routesSchemas.change_password.safeParse(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  if (!authHeaderSuccess) {
    res.status(401).send("Invalid authentication");
    return;
  }

  try {
    const { user_id } = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET!
    ) as JWT;

    await updateUserPassword(user_id, data.password);

    res.send("Password changed successfully");
  } catch (err) {
    handleError(err as Error, res);
  }
}
