const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
// Get all the pending connection requests for the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user; // We get the user object from the auth middleware

    const connectionRequests = await ConnectionRequest.find({
      receiverId: user._id,
      status: "interested",
    }).populate(
      "senderId",
      //   "firstName lastName photoUrl age gender about skills"
      USER_SAFE_DATA
    ); // Populate sender details

    // If no connection requests found, return a message
    if (connectionRequests.length === 0) {
      return res.json({
        message: `No pending connection requests for ${user.firstName}`,
      });
    }
    res.json({
      message: `Pending connection requests for ${user.firstName}`,
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Get all the connections (accepted requests) for the logged-in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user; // We get the user object from the auth middleware
    const connections = await ConnectionRequest.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
      status: "accepted",
    }).populate("senderId receiverId", USER_SAFE_DATA); // Populate both sender and receiver details

    // If no connections found, return a message
    if (connections.length === 0) {
      return res.json({
        message: `No connections found for ${user.firstName}`,
      });
    }

    // // Extract only the user details of the connected user.
    // const data = connections.map((conn) => conn.senderId);

    // Extract only the user details of the connected user.
    const data = connections.map((conn) => {
      if (conn.senderId._id.toString() === user._id.toString())
        return conn.receiverId;
      else return conn.senderId;
    });

    res.json({
      message: `Connections for ${user.firstName}`,
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const user = req.user; // We get the user object from the auth middleware

    const page = parseInt(req.query?.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query?.limit) || 10; // Number of users per page
    const skip = (page - 1) * limit;

    // Find all connections (both sent and received) for the logged-in user
    const connections = await ConnectionRequest.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    })
      .select("senderId receiverId status")
      .populate("senderId receiverId", "firstName lastName");

    // Create sets to store IDs of logged-in user, his connections, ignored people, already sent the connectionRequest, to exclude from the feed
    const hideUsersFromFeed = new Set();
    connections.forEach((conn) => {
      hideUsersFromFeed.add(conn.senderId._id.toString());
      hideUsersFromFeed.add(conn.receiverId._id.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip) // For pagination
      .limit(limit); // Exclude the logged-in user, his connections, ignored people, people to whom user already sent the connectionRequest from the feed

    // If no users found, return a message
    if (users.length === 0) {
      return res.json({ message: "No other users found in the feed." });
    }
    res.json({
      message: `User feed for ${user.firstName}`,
      data: users,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
