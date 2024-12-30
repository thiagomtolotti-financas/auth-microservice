import { Request, Response } from "express";

export default function validate_token(req: Request, res: Response) {
  res.send("Success");
}
