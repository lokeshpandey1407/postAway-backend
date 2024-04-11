import mongoose from "mongoose";
import LikeSchema from "./like.schema.js";
import ApplicationError from "../../middlewares/errorHandler.middleware.js";
import PostSchema from "../posts/post.schema.js";

const LikeModel = mongoose.model("Like", LikeSchema);
const PostModel = mongoose.model("Post", PostSchema);

export default class LikeRepository {
  async like(userId, postId) {
    try {
      const like = new LikeModel({
        user: new mongoose.Types.ObjectId(userId),
        post: new mongoose.Types.ObjectId(postId),
      });
      const savedLike = await like.save();
      await PostModel.findByIdAndUpdate(postId, {
        $push: { likes: savedLike._id },
      });
    } catch (err) {
      console.log(err);
      if (err.code == 11000) {
        throw err;
      }
      throw new ApplicationError("Something went wrong", 500);
    }
  }
  async removeLike(id) {
    try {
      const like = await LikeModel.findByIdAndDelete(id);
      if (!post) {
        throw new ApplicationError("Post not found", 404);
      }
      await PostModel.findByIdAndUpdate(like.post, {
        $pull: { likes: like._id },
      });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
}
