import { UserDocument } from "@/models/UserModel";
import { hash } from "bcrypt";

export default async function hashPassword(
  this: UserDocument,
  next: () => void
) {
  if (this.isModified("password")) {
    this.password = await hash(this.password as string, 10);
  }

  next();
}
