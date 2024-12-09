import { UserAlreadyExistsError } from "@/errors";
import UserModel from "@/models/UserModel";
import generatePasswordCode from "@/utils/generatePasswordCode";

function isMongooseError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error;
}

export default async function createUserInDB(email: string) {
  const { code, expireTime } = generatePasswordCode();

  try {
    const user = await UserModel.create({
      email,
      password_code: code,
      password_code_expire_time: expireTime,
    });

    await user.save();

    return user;
  } catch (err) {
    if (isMongooseError(err) && err.code === 11000) {
      throw new UserAlreadyExistsError();
    }

    throw err;
  }
}
