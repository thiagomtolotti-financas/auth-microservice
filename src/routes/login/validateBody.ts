import { z } from "zod";
import passwordSchema from "@/schemas/zod/passwordSchema";

export default function validateBody(body: unknown) {
  const bodySchema = z
    .object({
      email: z.string().email(),
      password: passwordSchema,
    })
    .strict();

  return bodySchema.safeParse(body);
}
