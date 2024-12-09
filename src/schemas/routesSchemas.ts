import { z } from "zod";
import passwordSchema from "./zod/passwordSchema";
import emailObjectSchema from "./zod/emailObjectSchema";
import passwordObjectSchema from "./zod/passwordObjectSchema";
import codeSchema from "./zod/codeSchema";

const routesSchemas = {
  login: z
    .object({
      email: z.string().email(),
      password: passwordSchema,
    })
    .strict(),
  refresh_token: z
    .object({
      refresh_token: z.string(),
    })
    .strict(),
  create_user: emailObjectSchema,
  forgot_password_email: emailObjectSchema,
  password: z
    .object({
      code: codeSchema,
      password: passwordSchema,
      email: z.string().email(),
    })
    .strict(),
  change_password: passwordObjectSchema,
};

export default routesSchemas;
