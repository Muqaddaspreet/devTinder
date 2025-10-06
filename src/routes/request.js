const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

// Send the connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user; // We get the user object from the auth middleware
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error(
          `Invalid status type: ${status}. Allowed values are 'ignored' or 'interested'.`
        );
      }

      // if (fromUserId.toString() === toUserId) {
      //   throw new Error("You cannot send a connection request to yourself!");
      // }

      // Check if the receiver user exists
      const toUser = await User.findOne({
        _id: toUserId,
      });
      if (!toUser) {
        throw new Error("Receiver user not found!");
      }

      // Check if a connection request already exists between the two users
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { senderId: fromUserId, receiverId: toUserId },
          { senderId: toUserId, receiverId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Connection request already exists!");
      }

      const connectionRequest = new ConnectionRequest({
        senderId: fromUserId,
        receiverId: toUserId,
        status: status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: `Connection request sent to ${toUser.firstName} by ${user.firstName} successfully with status: ${status}!`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

// Accept or Reject the connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user; // We get the user object from the auth middleware
      const requestId = req.params.requestId;
      const status = req.params.status; // accepted or rejected

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error(
          `Invalid status type: ${status}. Allowed values are 'accepted' or 'rejected'.`
        );
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        receiverId: user._id, // Ensure that the logged-in user is the receiver of the request
        status: "interested", // Only interested requests can be accepted or rejected
      });
      if (!connectionRequest) {
        throw new Error("Connection request not found!");
      }

      // Update the status of the connection request from the API params
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Connection request ${status} successfully!`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
