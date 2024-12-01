import { z } from "zod";
import { Request, Response } from "express";
import authHeaderSchema from "../schemas/zod/authHeaderSchema";
import passwordSchema from "../schemas/zod/passwordSchema";

export default function change_password(req: Request, res: Response) {
  const { success: authHeaderSuccess } = authHeaderSchema.safeParse(
    req.headers.authorization
  );

  const { success } = validateData(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  if (!authHeaderSuccess) {
    res.status(401).send("Invalid authentication");
    return;
  }

  // TODO: Change password in DB

  res.send("Password changed successfully");
}

function validateData(body: unknown) {
  const bodySchema = z
    .object({
      password: passwordSchema,
    })
    .strict();

  return bodySchema.safeParse(body);
}
