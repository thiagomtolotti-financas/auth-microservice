import { User } from "@/models/UserModel";
import { ExpiredCodeError, InvalidCodeError } from "@/errors";

export default function validateCode(user: User, code: string) {
  if (user.password_code !== code) throw new InvalidCodeError();

  const codeExpireTime = user.password_code_expire_time;

  if (!codeExpireTime || Date.now() > codeExpireTime.getTime()) {
    throw new ExpiredCodeError();
  }
}
