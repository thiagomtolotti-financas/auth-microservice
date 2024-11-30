import { Request } from "express";

export default function isRequestAuthenticated(req: Request): boolean {
  if (!req.headers.authorization) {
    return false;
  }

  const [type, access_token] = req.headers.authorization.split(" ");

  if (type !== "Bearer") return false;

  // TODO: Validate access_token in DB

  return true;
}
