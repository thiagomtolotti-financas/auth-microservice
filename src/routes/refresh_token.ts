import { Request, Response } from "express";
import authHeaderSchema from "../schemas/zod/authHeaderSchema";

export default function refresh_token(req: Request, res: Response) {
  const { success, data: access_token } = authHeaderSchema.safeParse(
    req.headers.authorization
  );

  if (!success) {
    res.status(401).send("Invalid authentication");
    return;
  }

  // TODO: Find user in DB
  // TODO: Refresh the user token

  res.send("access_token");
}
