import ApplicationError from "../../middlewares/errorHandler.middleware.js";
import CommentRepository from "./comment.repository.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async add(req, res, next) {
    try {
      const postId = req.params.postId;
      const userId = req.userId;
      const comment = await this.commentRepository.addComment(
        userId,
        postId,
        req.body
      );
      if (comment) {
        res.status(201).json({
          success: true,
          message: "Successfully commented on the post",
          data: comment,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Something went wrong. Please try again later.",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const id = req.params.commentId;
      const { comment } = req.body;
      const userId = req.userId;
      const resComment = await this.commentRepository.updateComment(
        id,
        userId,
        comment
      );
      if (resComment) {
        res.status(200).json({
          success: true,
          message: "Comment updated successfully",
          data: resComment,
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      let id = req.params.commentId;
      const userId = req.userId;
      await this.commentRepository.deleteComment(id, userId);
      res.status(201).json({
        success: true,
        message: "Comment deleted Successfully",
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async getAll(req, res, next) {
    try {
      const postId = req.params.postId;
      const comments = await this.commentRepository.getAll(postId);
      res.status(200).json({
        success: true,
        message: "",
        data: comments,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
