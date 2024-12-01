import { z } from "zod";
import { Request, Response } from "express";

export default function create_password_email(req: Request, res: Response) {
  const { success } = validateData(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
  }

  // TODO: Logic to create user in DB
  // TODO: Logic to send the user the email with the code to create the password

  res.send("Email sent successfully");
}

function validateData(body: unknown) {
  const emailSchema = z
    .object({
      email: z.string().email(),
    })
    .strict();

  return emailSchema.safeParse(body);
}
