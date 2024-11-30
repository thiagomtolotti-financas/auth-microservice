import { Request, Response } from "express";
import validateEmail from "../utils/validateEmail";
import validatePassword from "../utils/validatePassword";

export default function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!validateEmail(email) || !validatePassword(password)) {
    res.status(400).send("Invalid parameters");
    return;
  }

  //  TODO: Find user in DB and return tokens

  res.send({ email, password });
}
