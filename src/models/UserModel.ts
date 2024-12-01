import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface User extends Document {
  email: string;
  password?: string;
  password_code?: string;
  password_code_expire_time?: Date;
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
    password: { type: String },
    password_code: { type: String },
    password_code_expire_time: { type: Date },
    is_active: { type: Boolean, default: true },
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

const UserModel: Model<User> = mongoose.model<User>("Users", userSchema);

export default UserModel;
