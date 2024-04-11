import express from "express";
import CommentController from "./comment.controller.js";

const commentRoutes = express.Router();
const commentController = new CommentController();

commentRoutes.get("/:postId", (req, res, next) => {
  commentController.getAll(req, res, next);
});

commentRoutes.post("/:postId", (req, res, next) => {
  commentController.add(req, res, next);
});
commentRoutes.delete("/:commentId", (req, res, next) => {
  commentController.delete(req, res, next);
});
commentRoutes.put("/:commentId", (req, res, next) => {
  commentController.update(req, res, next);
});

export default commentRoutes;
