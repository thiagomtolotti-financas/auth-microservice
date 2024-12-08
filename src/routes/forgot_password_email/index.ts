import { Request, Response } from "express";
import sendgrid, { MailDataRequired } from "@sendgrid/mail";

import UserModel from "@/models/UserModel";

import resetPassword from "./resetPassword";

import { UserNotFoundError } from "@/errors";
import handleError from "@/errors/handleError";
import emailObjectSchema from "@/schemas/zod/emailObjectSchema";

export default async function forgot_password_email(
  req: Request,
  res: Response
) {
  const { success, data } = emailObjectSchema.safeParse(req.body);

  if (!success) {
    res.status(400).send("Invalid parameters");
    return;
  }

  try {
    const user = await UserModel.findOne({ email: data.email });

    if (!user) throw new UserNotFoundError();

    const { code } = await resetPassword(user);

    const message: MailDataRequired = {
      from: "thiagotolotti@thiagotolotti.com",
      to: user.email,
      subject: "Solicitação de redefinição de senha!",
      text: `Foi feita uma solicitação para redefinir sua senha, para isso basta inserir o código ${code}`,
    };

    await sendgrid.send(message);

    res.send("Email sent successfully");
  } catch (err) {
    handleError(err as Error, res);
  }
}
