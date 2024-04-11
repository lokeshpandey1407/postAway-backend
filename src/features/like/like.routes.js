import express from "express";
import LikeController from "./like.controller.js";

const likeRoutes = express.Router();
const likeController = new LikeController();

likeRoutes.post("/:id", (req, res, next) => {
  likeController.like(req, res, next);
});

likeRoutes.delete("/:id", (req, res, next) => {
  likeController.removeLike(req, res, next);
});

export default likeRoutes;
