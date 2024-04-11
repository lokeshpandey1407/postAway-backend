import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);
export default CommentSchema;
