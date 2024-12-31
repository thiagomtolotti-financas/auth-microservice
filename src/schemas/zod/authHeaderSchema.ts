import { z } from "zod";

const authHeaderSchema = z
  .string()
  .regex(/^Bearer\s.+$/)
  .transform((header) => header.replace(/^Bearer\s/, "")); // Extract only the token;

export default authHeaderSchema;
