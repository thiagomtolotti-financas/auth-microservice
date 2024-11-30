import { Request, Response } from "express";
import validatePassword from "../utils/validatePassword";

export default function password(req: Request, res: Response) {
  const { code, password } = req.body;

  // TODO: Make utilitary function to validate code
  if (!code || !validatePassword(password)) {
    res.status(400).send("Invalid parameters");
  }

  // TODO: Find user with the code in DB currently and set password

  res.send("Password set successfully");
}
