import { User } from "../../models/UserModel";
import EXPIRATION_TIME_IN_SECONDS from "../../constants/EXPIRATION_TIME_IN_SECONDS";
import { sign } from "jsonwebtoken";

export default async function generateUserTokens(user: User) {
  const access_token = sign({ user_id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: EXPIRATION_TIME_IN_SECONDS,
  });

  const refresh_token = sign({ user_id: user.id }, process.env.JWT_SECRET!);

  await user.updateOne({
    refresh_token,
  });

  return { access_token, refresh_token };
}
