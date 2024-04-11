import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: true,
    },
  },
  { timestamps: true }
);
export default FriendRequestSchema;
