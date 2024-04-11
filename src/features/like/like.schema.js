import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);
LikeSchema.index({ user: 1, post: 1 }, { unique: true });
export default LikeSchema;
