import { Request, Response } from "express";

import validateBody from "./validateBody";
import findUser from "./findUser";
import generateUserTokens from "./generateUserTokens";

import handleError from "../../errors/handleError";

export default async function login(req: Request, res: Response) {
  const { success, data } = validateBody(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  const { email, password } = data;

  try {
    const user = await findUser(email, password);

    const tokens = await generateUserTokens(user);

    res.send({ ...tokens, email });
  } catch (err) {
    handleError(err as Error, res);
  }
}
