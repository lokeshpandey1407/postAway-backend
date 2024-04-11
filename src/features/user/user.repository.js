import mongoose from "mongoose";
import UserSchema from "./user.schema.js";
import ApplicationError from "../../middlewares/errorHandler.middleware.js";
import UserProfileRepository from "../userProfile/userProfile.repository.js";

const UserModel = mongoose.model("User", UserSchema);
const userProfileRepository = new UserProfileRepository();

export default class UserRepository {
  constructor() {
    this.userProjection = {
      name: 1,
      age: 1,
      gender: 1,
      mobile: 1,
      bio: 1,
      email: 1,
      role: 1,
    };
  }
  async signup(userData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newUser = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        ...userData,
      });
      const { name, gender } = userData;
      await newUser.save({ session });
      const profile = await userProfileRepository.create(
        { name, gender },
        newUser._id
      );
      await UserModel.findByIdAndUpdate(
        newUser._id,
        {
          userProfile: profile._id,
        },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return newUser;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else if (err.code == 11000) {
        throw err;
      } else throw new ApplicationError("Something went wrong", 500);
    }
  }
  async signin(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else throw new ApplicationError("Something went wrong", 500);
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      user.populate("posts");
      return user;
    } catch (err) {
      console.log(err);
      throw ApplicationError("Something went wrong", 500);
    }
  }
  async getUserById(id) {
    try {
      const user = await UserModel.findById(id, this.userProjection);
      user.populate("posts");
      return user;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
  async getAllUsers() {
    try {
      const users = await UserModel.find({}, this.userProjection);
      return users;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  //for checking if the email is associated with any user when resetting the password
  async isValidUser(email) {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async resetPassword(email, password) {
    try {
      const user = await UserModel.findOneAndUpdate({ email }, { password });
      return user;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  //pending
  async deleteUser(req, res) {}

  //pending
  async updateRole(req, res) {}
}
