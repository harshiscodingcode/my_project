import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    planTier: { type: String, enum: ["free", "student", "pro"], default: "free", index: true }
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: string };

export const UserModel = (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);
