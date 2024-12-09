import { UserDocument } from "@/models/UserModel";

import { hash } from "bcrypt";

export default async function updateHashPassword(
  this: UserDocument,
  next: () => void
) {
  const update = this.getUpdate(); // Access the update object

  if (update && typeof update === "object" && "password" in update) {
    update.password = await hash(update.password, 10);
  }

  next();
}
