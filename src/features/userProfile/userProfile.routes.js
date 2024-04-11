import express from "express";
import UserProfileController from "./userProfile.controller.js";
import Auth from "../../middlewares/jwt.middleware.js";

const userProfileRoutes = express.Router();
const userProfileController = new UserProfileController();

userProfileRoutes.get("/get-all-details", Auth, (req, res, next) => {
  userProfileController.getAllProfile(req, res, next);
});
userProfileRoutes.get("/get-details/:profileId", Auth, (req, res, next) => {
  userProfileController.getProfile(req, res, next);
});

userProfileRoutes.put("/update-details/:profileId", Auth, (req, res, next) => {
  userProfileController.updateProfile(req, res, next);
});

export default userProfileRoutes;
