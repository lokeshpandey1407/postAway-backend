import mongoose from "mongoose";
import ApplicationError from "../../middlewares/errorHandler.middleware.js";
import UserProfileSchema from "../userProfile/userProfile.schema.js";
import FriendRequestSchema from "./friendRequest.schema.js";

const FriendRequestModel = mongoose.model("FriendRequest", FriendRequestSchema);
const UserProfileModule = mongoose.model("UserProfile", UserProfileSchema);

export default class FriendRequestRepository {
  async sendRequest(senderId, recipientId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      //checking if the request is already present in the recipient's receivedFriendRequests Array
      const existingRequest = await FriendRequestModel.findOne({
        sender: senderId,
        recipient: recipientId,
        status: "pending",
      }).session(session);

      //if present then throw an error
      if (existingRequest) {
        throw new ApplicationError("Friend Request already sent.", 400);
      }

      //creating friend Request model
      const friendRequest = new FriendRequestModel({
        _id: new mongoose.Types.ObjectId(),
        sender: new mongoose.Types.ObjectId(senderId),
        recipient: new mongoose.Types.ObjectId(recipientId),
        status: "pending",
      });
      await friendRequest.save({ session });

      //pushing the friend request in the sender's sentFriendRequest Array
      await UserProfileModule.findByIdAndUpdate(senderId, {
        $push: { sentFriendRequests: friendRequest._id },
      });

      //pushing the friendRequest in the receiver's receivedFriendRequest Array
      await UserProfileModule.findByIdAndUpdate(recipientId, {
        $push: { receivedFriendRequests: friendRequest._id },
      });
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong", 500);
      }
    }
  }

  async acceptRequest(friendRequestId, requestStatus) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      //getting friend request by id
      const friendRequest = await FriendRequestModel.findById(friendRequestId);
      if (!friendRequest) {
        throw new ApplicationError("Friend Request not found", 404);
      }
      //updating the status of friend Request
      const updatedFriendRequest = await FriendRequestModel.findByIdAndUpdate(
        friendRequest._id,
        {
          status: requestStatus,
        }
      );
      if (requestStatus === "accepted") {
        //if request is accepted then add it to the recipient friends list
        await UserProfileModule.findByIdAndUpdate(
          updatedFriendRequest.recipient,
          {
            $push: {
              friends: new mongoose.Types.ObjectId(updatedFriendRequest.sender),
            },
          },
          { session }
        );
        await UserProfileModule.findByIdAndUpdate(
          updatedFriendRequest.sender,
          {
            $push: {
              friends: new mongoose.Types.ObjectId(
                updatedFriendRequest.recipient
              ),
            },
          },
          { session }
        );
      }
      //else remove the friend request from the receivedFriendRequest list
      await UserProfileModule.findByIdAndUpdate(
        updatedFriendRequest.recipient,
        {
          $pull: { receivedFriendRequests: updatedFriendRequest._id },
        },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong", 500);
      }
    }
  }

  async getFriends(profileId) {
    try {
      const userProfile = await UserProfileModule.findById(profileId).populate({
        path: "friends",
      });
      if (!userProfile) {
        throw new ApplicationError("User profile not found", 404);
      }
      const userFriends = userProfile.friends;
      return userFriends;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong", 500);
      }
    }
  }

  async pendingRequest(senderId) {
    try {
      const pendingRequests = await FriendRequestModel.find({
        sender: senderId,
        status: "pending",
      })
        .populate("sender")
        .populate("recipient");
      return pendingRequests;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong", 500);
      }
    }
  }
}
