import express from "express";
import PostsController from "./posts.controller.js";
import { upload } from "../../middlewares/file.middleware.js";
import { PostValidation } from "../../middlewares/postValidation.middleware.js";
import Auth from "../../middlewares/jwt.middleware.js";

const postRoutes = express.Router();
const postsController = new PostsController();

postRoutes.get("/", Auth, (req, res, next) => {
  postsController.getAllPosts(req, res, next);
});
postRoutes.get("/user-posts/:userId", Auth, (req, res, next) => {
  postsController.getAllPostsByUserId(req, res, next);
});
postRoutes.get("/:postId", Auth, (req, res, next) => {
  postsController.getById(req, res, next);
});
postRoutes.post("/", Auth, upload, PostValidation, (req, res, next) => {
  postsController.addPost(req, res, next);
});
postRoutes.put("/:postId", Auth, upload, PostValidation, (req, res, next) => {
  postsController.updatePost(req, res, next);
});
postRoutes.delete("/:postId", Auth, (req, res, next) => {
  postsController.deletePost(req, res, next);
});

export default postRoutes;
