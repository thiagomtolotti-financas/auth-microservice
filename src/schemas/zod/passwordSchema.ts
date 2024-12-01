import { z } from "zod";

const atLeastOneLetter = /[a-zA-Z]/;
const atLeastOneNumber = /\d/;

const passwordSchema = z
  .string()
  .min(6)
  .regex(atLeastOneLetter)
  .regex(atLeastOneNumber);

export default passwordSchema;
