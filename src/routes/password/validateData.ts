import { z } from "zod";
import passwordSchema from "@/schemas/zod/passwordSchema";

export default function validateData(body: unknown) {
  const codeSchema = z
    .union([
      z.string().regex(/^\d{4}$/),
      z.number().int().gte(1000).lte(9999), // Allow integer codes from 1000 to 9999
    ])
    .transform((value) => value.toString());

  const bodySchema = z
    .object({
      code: codeSchema,
      password: passwordSchema,
      email: z.string().email(),
    })
    .strict();

  return bodySchema.safeParse(body);
}
