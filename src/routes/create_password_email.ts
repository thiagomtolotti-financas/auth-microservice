import { Request, Response } from "express";
import validateEmail from "../utils/validateEmail";

export default function create_password_email(req: Request, res: Response) {
  const { email } = req.body;

  if (!validateEmail(email)) {
    res.status(400).send("Invalid parameters");
  }

  // TODO: Logic to create user in DB
  // TODO: Logic to send the user the email with the code to create the password

  res.send("Email sent successfully");
}
