import { z } from "zod";
import passwordSchema from "./passwordSchema";

const loginSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
  })
  .strict();

export default loginSchema;
