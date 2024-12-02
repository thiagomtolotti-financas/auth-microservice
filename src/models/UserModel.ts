import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema, UpdateQuery } from "mongoose";

export interface User extends Document {
  email: string;
  password: string | null;
  password_code: string | null;
  password_code_expire_time: Date | null;
  refresh_token: string | null;
  is_active: boolean;
}

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, default: null },
    password_code: { type: String, default: null },
    password_code_expire_time: { type: Date, default: null },
    is_active: { type: Boolean, default: true },
    refresh_token: { type: String, default: null },
  },
  { timestamps: true }
);

// Hashes the user's password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password as string, 10);
  }

  next();
});

userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate(); // Access the update object

  if (update && typeof update === "object" && "password" in update) {
    const updateQuery = update as UpdateQuery<{ password?: string }>;

    if (updateQuery.password) {
      updateQuery.password = await bcrypt.hash(updateQuery.password, 10);
    }
  }
  next();
});

const UserModel: Model<User> = mongoose.model<User>("Users", userSchema);

export default UserModel;
