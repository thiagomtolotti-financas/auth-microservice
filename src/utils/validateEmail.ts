import { z } from "zod";

export default function validateEmail(email: string): boolean {
  const schema = z.string().email();

  return schema.safeParse(email).success;
}
