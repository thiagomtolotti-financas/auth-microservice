import { z } from "zod";
import passwordSchema from "./passwordSchema";

const passwordObjectSchema = z
  .object({
    password: passwordSchema,
  })
  .strict();

export default passwordObjectSchema;
