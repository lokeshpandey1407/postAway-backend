import mongoose from "mongoose";
import BlackListSchema from "./blacklistToken.schema.js";
import ApplicationError from "../../../middlewares/errorHandler.middleware.js";

const BlacklistModel = mongoose.model("Blacklist", BlackListSchema);

export default class BlacklistRepository {
  async getAll() {
    try {
      const expiredTokens = await BlacklistModel.find({});
      return expiredTokens;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
  async addToBlacklist(token, userId) {
    try {
      const expiredToken = new BlacklistModel({
        token,
        user: new mongoose.Types.ObjectId(userId),
      });
      await expiredToken.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
}
