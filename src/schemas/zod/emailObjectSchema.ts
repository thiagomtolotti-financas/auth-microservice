import { z } from "zod";

const emailObjectSchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

export default emailObjectSchema;
