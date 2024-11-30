import { z } from "zod";

export default function validatePassword(password: string): boolean {
  const atLeastOneLetter = /[a-zA-Z]/;
  const atLeastOneNumber = /\d/;
  const schema = z
    .string()
    .min(6)
    .regex(atLeastOneLetter)
    .regex(atLeastOneNumber);

  const res = schema.safeParse(password);

  return res.success;
}
