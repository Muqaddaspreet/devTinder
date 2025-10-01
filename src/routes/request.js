const express = require("express");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// Send the connection request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user; // We get the user object from the auth middleware
    // Sending a connection request
    console.log("Sending a connection request");
    res.send(user?.firstName + " sent the connection request successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
