import { Response } from "express";
import errors from ".";

export default function handleError(error: Error, res: Response) {
  if (errors.some((e) => error instanceof e)) {
    res.status(400).send(error.message);
    return;
  }

  console.error(error);
  res.status(500).send("Internal Server Error");
}
