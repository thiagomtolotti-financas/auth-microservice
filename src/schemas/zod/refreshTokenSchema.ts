import { z } from "zod";

const refreshTokenSchema = z
  .object({
    refresh_token: z.string(),
  })
  .strict();

export default refreshTokenSchema;
