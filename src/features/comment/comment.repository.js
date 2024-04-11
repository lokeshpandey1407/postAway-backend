import mongoose from "mongoose";
import CommentSchema from "./comment.schema.js";
import PostSchema from "../posts/post.schema.js";
import ApplicationError from "../../middlewares/errorHandler.middleware.js";

const CommentModel = mongoose.model("Comment", CommentSchema);
const PostModel = mongoose.model("Post", PostSchema);

export default class CommentRepository {
  async addComment(userId, postId, data) {
    const { comment } = data;
    try {
      const newComment = new CommentModel({
        _id: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(userId),
        post: new mongoose.Types.ObjectId(postId),
        comment,
      });
      await newComment.save();
      await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });
      return newComment;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async updateComment(id, userId, comment) {
    try {
      const foundComment = await CommentModel.findById(id);
      if (userId != foundComment.user) {
        throw new ApplicationError(
          "Unauthorized action. Comment cannot be updated",
          500
        );
      }
      const updateComment = await CommentModel.findByIdAndUpdate(id, {
        comment,
      });
      return updateComment;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async deleteComment(id, userId) {
    try {
      const comment = await CommentModel.findById(id);
      const post = await PostModel.findById(comment.post);
      if (!comment) {
        throw new ApplicationError("Comment not found", 404);
      }
      //checking if the user is the author of the comment or the user is the author of the post
      if (userId != comment.user || userId != post.user) {
        throw new ApplicationError(
          "Unauthorized action. Comment cannot be deleted",
          500
        );
      }
      await CommentModel.deleteOne({ _id: id });
      await PostModel.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id },
      });
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      } else throw new ApplicationError("Something went wrong", 500);
    }
  }

  async getAll(postId) {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new ApplicationError("Post not found", 404);
      } else {
        const posts = (await post.populate("comments")).comments;
        return posts;
      }
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
