import express from "express";
import UserController from "./user.controller.js";
import { UserValidation } from "../../middlewares/userValidation.middleware.js";
import Auth from "../../middlewares/jwt.middleware.js";

const userRoutes = express.Router();
const userController = new UserController();

userRoutes.get("/all", Auth, (req, res, next) => {
  userController.getUsers(req, res, next);
});
userRoutes.get("/:id", Auth, (req, res, next) => {
  userController.getUserById(req, res, next);
});
userRoutes.post("/signin", (req, res, next) => {
  userController.signIn(req, res, next);
});
userRoutes.post("/signup", (req, res, next) => {
  UserValidation, userController.addUser(req, res, next);
});
userRoutes.post("/logout", Auth, (req, res, next) => {
  userController.signOut(req, res, next);
});
userRoutes.post("/otp/send", (req, res, next) => {
  userController.sendResetPasswordOtp(req, res, next);
});
userRoutes.post("/otp/resetPassword", (req, res, next) => {
  userController.resetPassword(req, res, next);
});

export default userRoutes;
