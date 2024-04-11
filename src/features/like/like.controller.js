import ApplicationError from "../../middlewares/errorHandler.middleware.js";
import LikeRepository from "./like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async like(req, res, next) {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      await this.likeRepository.like(userId, postId);
      res.status(201).json({
        success: true,
        message: "Successfully liked the post",
        data: post,
      });
    } catch (err) {
      console.log(err);
      if (err.code == 11000) {
        res.status(400).json({
          success: false,
          message: "Invalid action, User Already liked the post. ",
        });
      } else {
        next(err);
      }
    }
  }

  async removeLike(req, res, next) {
    try {
      const id = req.params.id;
      await this.likeRepository.removeLike(id);

      res.status(201).json({
        success: true,
        message: "Successfully removed the like",
        data: post,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
