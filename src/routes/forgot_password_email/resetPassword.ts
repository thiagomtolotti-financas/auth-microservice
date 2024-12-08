import { User } from "@/models/UserModel";
import generatePasswordCode from "@/utils/generatePasswordCode";

export default async function resetPassword(user: User) {
  const { code, expireTime } = generatePasswordCode();

  await user.updateOne({
    password_code: code,
    password_code_expire_time: expireTime,
  });

  return { code, expireTime };
}
