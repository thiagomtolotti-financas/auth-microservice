import { Request, Response } from "express";
import { z } from "zod";
import passwordSchema from "../schemas/zod/passwordSchema";

export default function login(req: Request, res: Response) {
  const { success, data } = validateBody(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  const { email, password } = data;

  //  TODO: Find user in DB
  //  TODO: Generate access and refresh tokens and return them

  res.send({ email, password });
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
