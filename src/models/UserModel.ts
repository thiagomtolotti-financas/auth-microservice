import hashPassword from "@/utils/hashPassword";
import updateHashPassword from "@/utils/updateHashPassword";
import mongoose, { Document, Model, Query, Schema } from "mongoose";

export interface User extends Document {
  email: string;
  password: string | null;
  password_code: string | null;
  password_code_expire_time: Date | null;
  refresh_token: string | null;
  is_active: boolean;
  id: string;
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

export type UserDocument = mongoose.Document &
  Query<unknown, unknown, unknown, unknown, "find", Record<string, never>> & {
    password: string;
  };

// Hashes the user's password before saving
userSchema.pre("save", hashPassword);

userSchema.pre("updateOne", updateHashPassword);

const UserModel: Model<User> = mongoose.model<User>("Users", userSchema);

export default UserModel;
