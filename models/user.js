import { Schema, model } from "mongoose";
import findOrCreate from "mongoose-findorcreate";

const userSchema = new Schema(
  {
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.plugin(findOrCreate);

export const User = model("user", userSchema);
