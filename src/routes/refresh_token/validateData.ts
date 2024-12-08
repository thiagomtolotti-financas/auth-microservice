import { z } from "zod";

export default function validateData(data: unknown) {
  const schema = z
    .object({
      refresh_token: z.string(),
    })
    .strict();

  return schema.safeParse(data);
}
