import { Request, Response } from "express";
import { z } from "zod";
import passwordSchema from "../schemas/zod/passwordSchema";

export default function password(req: Request, res: Response) {
  const { success } = validateData(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  // TODO: Find user with the code in DB currently and set password

  res.send("Password set successfully");
}

function validateData(body: unknown) {
  // TODO: Make regex to validate code
  const bodySchema = z
    .object({
      code: z.string(),
      password: passwordSchema,
    })
    .strict();

  return bodySchema.safeParse(body);
}
