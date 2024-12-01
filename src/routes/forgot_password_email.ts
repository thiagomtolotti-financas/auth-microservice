import { Request, Response } from "express";
import { z } from "zod";

export default function forgot_password_email(req: Request, res: Response) {
  const { success } = validateData(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
  }

  // TODO: Logic to finc user in DB and setup for reseting password
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
