import { Request, Response } from "express";
import { z } from "zod";
import UserModel, { User } from "../models/UserModel";
import { UserNotFoundError } from "../errors";
import generatePasswordCode from "../utils/generatePasswordCode";
import handleError from "../errors/handleError";
import sendgrid, { MailDataRequired } from "@sendgrid/mail";

export default async function forgot_password_email(
  req: Request,
  res: Response
) {
  const { success, data } = validateData(req.body);

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

function validateData(body: unknown) {
  const emailSchema = z
    .object({
      email: z.string().email(),
    })
    .strict();

  return emailSchema.safeParse(body);
}

async function resetPassword(user: User) {
  const { code, expireTime } = generatePasswordCode();

  await user.updateOne({
    password_code: code,
    password_code_expire_time: expireTime,
  });

  return { code, expireTime };
}
