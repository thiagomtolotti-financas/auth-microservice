import { Request, Response } from "express";

export default function refresh_token(req: Request, res: Response) {
  if (!isRequestAuthenticated(req)) {
    res.status(401).send("Invalid authentication");
    return;
  }

  res.send("access_token");
}

function isRequestAuthenticated(req: Request): boolean {
  if (!req.headers.authorization) {
    return false;
  }

  const [type, access_token] = req.headers.authorization.split(" ");

  if (type !== "Bearer") return false;

  // TODO: Validate access_token in DB

  return true;
}
