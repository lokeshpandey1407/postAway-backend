import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    mobile: {
      type: Number,
    },
    bio: { type: String },
    avatarUrl: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }],
    sentFriendRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "FriendRequest" },
    ],
    receivedFriendRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "FriendRequest" },
    ],
  },
  { timestamps: true }
);

export default UserProfileSchema;
