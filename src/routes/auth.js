const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const authRouter = express.Router();

// Register the user
authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // console.log(req.body);

    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash, // Storing the encrypted password in the database
    });
    await user.save(); // This function will return a promise.
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user. " + err.message);
  }
});

// Login the user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required.");
    } else if (!validator.isEmail(email)) {
      throw new Error("A valid email is required.");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found with this email.");
    }

    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Incorrect password.");
    }

    // // Create a JWT token
    // const token = jwt.sign({ _id: user._id }, "DEV@TINDER$2000", {
    //   expiresIn: "365d",
    // });

    // Get the jwt token using the method we created in user model
    const token = await user.getJWT();

    console.log("Generated JWT Token:", token);
    // Add the token to the cookie and send the response back to the user.
    res.cookie("session_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year

      // secure: true, // Uncomment this line when using HTTPS
      // maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });
    res.json({
      message: "User logged in successfully!",
      user,
    });
  } catch (err) {
    res.status(400).send("User login failed: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  // We remove the token from the cookie And expire the cookie there itself.
  res.cookie("session_token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful!!"); // User logged out successfully
});

module.exports = authRouter;
