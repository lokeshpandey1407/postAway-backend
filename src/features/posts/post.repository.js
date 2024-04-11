import mongoose from "mongoose";
import PostSchema from "./post.schema.js";
import ApplicationError from "../../middlewares/errorHandler.middleware.js";
import UserSchema from "../user/user.schema.js";

const PostModel = mongoose.model("Post", PostSchema);
const UserModel = mongoose.model("User", UserSchema);
export default class PostRepository {
  async getAll() {
    try {
      const posts = await PostModel.find({})
        .populate("likes")
        .populate("comments");
      return posts;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async getAllPostByUser(userId) {
    try {
      const posts = await PostModel.find({ user: userId })
        .populate("likes")
        .populate("comments");
      return posts;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async getPostById(id) {
    try {
      const post = await PostModel.findById(id)
        .populate("likes")
        .populate("comments");
      return post;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async addPost(postData, imageUrl, userId, likes, comments) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const post = new PostModel({
        _id: new mongoose.Types.ObjectId(),
        ...postData,
        imageUrl,
        user: new mongoose.Types.ObjectId(userId),
        likes,
        comments,
      });
      await post.save({ session });
      await UserModel.findByIdAndUpdate(
        userId,
        {
          $push: { posts: post._id },
        },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return post;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async updatePost(id, postData, imageUrl, userId) {
    try {
      const foundPost = await PostModel.findById(id);
      console.log(foundPost);
      //here checking if the user is the owner of the post or not
      if (!foundPost) {
        throw new ApplicationError("Post not found", 404);
      }
      if (foundPost.user != userId) {
        throw new ApplicationError("Post cannot be updated by the user", 500);
      }
      const post = await PostModel.findByIdAndUpdate(id, {
        ...postData,
        imageUrl,
      });
      return post;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async deletePost(id, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const post = await PostModel.findById(id);
      const user = await UserModel.findById(userId);
      //here checking if the user is the owner of the post or not
      if (user._id != userId) {
        throw new ApplicationError("Post cannot be deleted", 400);
      }
      await PostModel.deleteOne({ _id: id }, { session });
      await UserModel.findByIdAndUpdate(
        post.user,
        {
          $pull: { posts: post._id },
        },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
}
