const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Get the profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // // Authentication
    // const cookies = req.cookies;
    // console.log("Cookie :", cookies);
    // const { session_token } = cookies;
    // console.log(session_token);

    // // // Validate the token:
    // // if (!session_token || session_token !== "dummy_session_token") {
    // //   return res.status(401).send("Unauthorized: Invalid or missing token");
    // // }

    // const decodedMessage = jwt.verify(session_token, "DEV@TINDER$2000"); // We pass the same secret key here that we used to create the token.

    // if (!session_token || !decodedMessage) {
    //   throw new Error("Invalid or missing token");
    // }

    // console.log(decodedMessage);
    // const { _id } = decodedMessage;
    // console.log("User ID from of the logged in user from token:", _id);
    // // Fetch the user profile from the database using the user ID
    // const user = await User.findById(_id);

    const user = req.user; // We get the user object from the auth middleware

    // if (!user) {
    //   throw new Error("User not found");
    // }
    res.json({ message: "User profile data", user });
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
});

// Update the profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid Update Request!");
    }

    const user = req.user; // We get the user object from the auth middleware
    console.log(user);
    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });
    console.log(user);
    await user.save();
    res.json({ message: "User profile updated successfully!", data: user });
  } catch (err) {
    res.status(400).send("Error: " + err.response.data);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user; // We get the user object from the auth middleware
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new Error("Old password and new password are required.");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol.",
      );
    }
    if (oldPassword === newPassword) {
      throw new Error("New password must be different from the old password.");
    }
    const isPasswordMatch = await user.validatePassword(oldPassword);
    if (!isPasswordMatch) {
      throw new Error("Incorrect old password.");
    }
    // Encrypt the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    console.log(passwordHash);
    user.password = passwordHash; // Storing the encrypted password in the database
    await user.save();
    res.send("Password updated successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = profileRouter;
