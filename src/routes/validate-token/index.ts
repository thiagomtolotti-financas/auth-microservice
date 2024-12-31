import { Request, Response } from "express";

import { WithUserId } from "@/globals";

export default async function validate_token(
  req: Request & WithUserId,
  res: Response
) {
  // TODO: Require API key in heade
  res.send({ user_id: req.user_id });
}
