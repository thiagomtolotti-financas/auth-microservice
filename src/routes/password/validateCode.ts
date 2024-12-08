import { User } from "@/models/UserModel";
import { ExpiredCodeError, InvalidCodeError } from "@/errors";

export default function validateCode(user: User, code: string) {
  const codeExpireTime = user.password_code_expire_time;

  if (user.password_code !== code) throw new InvalidCodeError();

  if (!codeExpireTime || Date.now() > codeExpireTime.getTime()) {
    throw new ExpiredCodeError();
  }
}
