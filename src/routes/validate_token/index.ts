import { Request, Response } from "express";

import { WithUserId } from "@/globals";

export default async function validate_token(
  req: Request & WithUserId,
  res: Response
) {
  // TODO: Require API Key in every request?
  if (req.headers["x-auth-api-key"] !== process.env.API_KEY) {
    res.status(401).send("Invalid API Key");
    return;
  }

  res.send({ user_id: req.user_id });
}
