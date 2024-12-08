import { Request, Response } from "express";
import sendgrid, { MailDataRequired } from "@sendgrid/mail";

import createUser from "./createUserInDB";

import handleError from "@/errors/handleError";
import routesSchemas from "@/schemas/routesSchemas";

export default async function create_user(req: Request, res: Response) {
  const { success, data } = routesSchemas.create_user.safeParse(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  try {
    const user = await createUser(data.email);

    const message: MailDataRequired = {
      from: "thiagotolotti@thiagotolotti.com",
      to: user.email,
      subject: "Sua conta foi criada!",
      text: `Sua conta foi criada, para validar basta inserir o código ${user.password_code}`,
    };

    await sendgrid.send(message);

    res.send("An email with the code for creating the password was sent!");
  } catch (err) {
    handleError(err as Error, res);
  }
}
