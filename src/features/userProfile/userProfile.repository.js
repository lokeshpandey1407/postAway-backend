import mongoose from "mongoose";
import UserProfileSchema from "./userProfile.schema.js";
import ApplicationError from "../../middlewares/errorHandler.middleware.js";
import UserSchema from "../user/user.schema.js";

const UserProfileModel = mongoose.model("UserProfile", UserProfileSchema);
const UserModel = mongoose.model("User", UserSchema);

export default class UserProfileRepository {
  constructor() {
    this.profileProjection = {
      name: 1,
      gender: 1,
      mobile: 1,
      bio: 1,
      friends: 1,
    };
  }
  async create(profileData, userId) {
    try {
      const profile = new UserProfileModel({
        _id: new mongoose.Types.ObjectId(),
        ...profileData,
        user: userId,
        mobile: "",
        bio: "",
        avatarUrl: "",
        friends: [],
        sentFriendRequests: [],
        receivedFriendRequests: [],
      });
      await profile.save();
      return profile;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async update(id, profileData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const profile = await UserProfileModel.findByIdAndUpdate(
        id,
        profileData,
        { new: true },
        { session }
      );
      if (!profile) {
        throw new ApplicationError("Profile not found", 404);
      }
      await UserModel.findByIdAndUpdate(profile.user, profileData, { session });
      await session.commitTransaction();
      session.endSession();
      return profile;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong", 500);
      }
    }
  }

  async get(id) {
    try {
      const profile = await UserProfileModel.findById(
        id,
        this.profileProjection
      );
      if (!profile) {
        throw new ApplicationError("Can't find the user profile", 404);
      }
      await profile.populate("friends");
      return profile;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong", 500);
      }
    }
  }

  async getAll() {
    try {
      const profiles = await UserProfileModel.find(
        {},
        this.profileProjection
      ).populate({
        path: "friends",
      });
      return profiles;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong", 500);
      }
    }
  }
}
