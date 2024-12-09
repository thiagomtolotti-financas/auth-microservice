import { UserDocument } from "@/models/UserModel";
import { UpdateQuery } from "mongoose";

import { hash } from "bcrypt";

export default async function updateHashPassword(
  this: UserDocument,
  next: () => void
) {
  const update = this.getUpdate(); // Access the update object

  if (update && typeof update === "object" && "password" in update) {
    const updateQuery = update as UpdateQuery<{ password?: string }>;

    if (updateQuery.password) {
      updateQuery.password = await hash(updateQuery.password, 10);
    }
  }

  next();
}
