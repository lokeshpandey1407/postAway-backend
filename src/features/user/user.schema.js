import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    email: {
      type: String,
      required: true,
      match: [/^.+@.+..+/, "Invalid Email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      match: [
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,116}$/,
        "Invalid Password",
      ],
    },
    role: {
      type: "String",
      enum: { values: ["Admin", "User"], message: "Invalid role type. " },
      required: true,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    userProfile: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" },
  },
  { timestamps: true }
);
export default UserSchema;
