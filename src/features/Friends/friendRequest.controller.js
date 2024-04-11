import FriendRequestRepository from "./friendRequest.repository.js";

export default class FriendRequestController {
  constructor() {
    this.friendRequestRepository = new FriendRequestRepository();
  }
  async sendRequest(req, res, next) {
    try {
      const id = req.params.id; //sender id
      const { receiverId } = req.body;
      await this.friendRequestRepository.sendRequest(id, receiverId);
      res.status(200).json({
        success: true,
        message: "Friend Request sent successfully",
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async acceptRequest(req, res, next) {
    try {
      const id = req.params.id; //friend request id
      const { requestStatus } = req.body;
      await this.friendRequestRepository.acceptRequest(id, requestStatus);
      if (requestStatus === "accepted") {
        res.status(200).json({
          success: true,
          message: "Friend Request accepted successfully",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Friend Request rejected successfully",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getFriends(req, res, next) {
    try {
      const id = req.params.profileId;
      const friends = await this.friendRequestRepository.getFriends(id);
      res.status(200).json({
        success: true,
        message: "",
        data: friends,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const senderId = req.params.senderId;
      const pendingRequest = await this.friendRequestRepository.pendingRequest(
        senderId
      );
      res.status(200).json({
        success: true,
        message: "",
        data: pendingRequest,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
