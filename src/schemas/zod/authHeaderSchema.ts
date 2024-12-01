import { z } from "zod";

const authHeaderSchema = z.string().regex(/^Bearer\s.+$/);

export default authHeaderSchema;
