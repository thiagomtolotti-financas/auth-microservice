import { Request, Response } from "express";
import isRequestAuthenticated from "../utils/isRequestAuthenticated";

export default function refresh_token(req: Request, res: Response) {
  if (!isRequestAuthenticated(req)) {
    res.status(401).send("Invalid authentication");
    return;
  }

  res.send("access_token");
}
