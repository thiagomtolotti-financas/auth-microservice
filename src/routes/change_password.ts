import { Request, Response } from "express";
import validatePassword from "../utils/validatePassword";
import isRequestAuthenticated from "../utils/isRequestAuthenticated";

export default function change_password(req: Request, res: Response) {
  const { password } = req.body;

  if (!validatePassword(password)) {
    res.status(400).send("Invalid parameters");
    return;
  }

  if (!isRequestAuthenticated(req)) {
    res.status(401).send("Invalid authentication");
    return;
  }

  // TODO: Change password in DB

  res.send("Password changed successfully");
}
