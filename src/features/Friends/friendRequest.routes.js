import express from "express";
import FriendRequestController from "./friendRequest.controller.js";

const friendRequestRoutes = express.Router();
const friendRequestController = new FriendRequestController();

//send sender profile id as params
friendRequestRoutes.post("/send-friend-request/:id", (req, res, next) => {
  friendRequestController.sendRequest(req, res, next);
});

//send friend request id as params
friendRequestRoutes.post("/accept-friend-request/:id", (req, res, next) => {
  friendRequestController.acceptRequest(req, res, next);
});

friendRequestRoutes.get("/:profileId", (req, res, next) => {
  friendRequestController.getFriends(req, res, next);
});

friendRequestRoutes.get("/pending/:senderId", (req, res, next) => {
  friendRequestController.getPendingRequests(req, res, next);
});

export default friendRequestRoutes;
