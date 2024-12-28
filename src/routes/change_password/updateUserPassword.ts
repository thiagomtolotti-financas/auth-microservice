import { UserNotFoundError } from "@/errors";

import UserModel from "@/models/UserModel";

export default async function updateUserPassword(
  user_id: string,
  new_password: string
) {
  const user = await UserModel.findById(user_id);

  if (!user) throw new UserNotFoundError();

  await user.updateOne({
    password_code: null,
    password_code_expire_time: null,
    password: new_password,
  });
}
