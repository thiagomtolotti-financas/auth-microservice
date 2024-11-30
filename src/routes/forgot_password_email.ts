import { Request, Response } from "express";
import validateEmail from "../utils/validateEmail";

export default function forgot_password_email(req: Request, res: Response) {
  const { email } = req.body;

  if (!validateEmail(email)) {
    res.status(400).send("Invalid parameters");
  }

  // TODO: Logic to finc user in DB and setup for reseting password
  // TODO: Logic to send the user the email with the code to create the password

  res.send("Email sent successfully");
}
