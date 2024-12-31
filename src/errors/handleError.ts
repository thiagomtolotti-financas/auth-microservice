import { Response } from "express";
import errors from ".";

export default function handleError(error: Error, res: Response, status = 400) {
  if (errors.some((e) => error instanceof e)) {
    res.status(status).send(error.message);
    return;
  }

  console.error(error);
  res.status(500).send("Internal Server Error");
}
