import ApplicationError from "../../middlewares/errorHandler.middleware.js";
import PostRepository from "./post.repository.js";

export default class PostsController {
  constructor() {
    this.postRepository = new PostRepository();
  }
  async addPost(req, res, next) {
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    const userId = req.userId;
    let likes = [],
      comments = [];
    try {
      const post = await this.postRepository.addPost(
        req.body,
        imageUrl,
        userId,
        likes,
        comments
      );
      if (post) {
        res.status(201).json({
          success: true,
          message: "Post created successfully",
          data: post,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Post cannot be created. Please try again",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async updatePost(req, res, next) {
    let id = req.params.postId;
    let userId = req.userId;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    try {
      const post = await this.postRepository.updatePost(
        id,
        req.body,
        imageUrl,
        userId
      );
      if (post) {
        res.status(201).json({
          success: true,
          message: "Post updated successfully",
          data: post,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Post cannot be updated. Please try again later",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      let id = req.params.postId;
      let userId = req.userId;
      await this.postRepository.deletePost(id, userId);
      res.status(201).json({
        success: true,
        message: "Post deleted Successfully",
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getAllPosts(req, res) {
    try {
      const posts = await this.postRepository.getAll();
      res.status(200).json({
        success: true,
        message: "",
        data: posts,
      });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async getAllPostsByUserId(req, res) {
    try {
      let id = req.params.userId;
      const posts = await this.postRepository.getAllPostByUser(id);
      res.status(200).json({
        success: true,
        message: "",
        data: posts,
      });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async getById(req, res) {
    try {
      let id = req.params.postId;
      const post = await this.postRepository.getPostById(id);
      if (post) {
        res.status(200).json({
          success: true,
          message: "",
          data: post,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Post not found with this Id",
        });
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
}
