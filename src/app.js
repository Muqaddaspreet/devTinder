const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Register the user
app.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(req.body.password, 10);
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
app.post("/login", async (req, res) => {
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
    res.send("User logged in successfully!");
  } catch (err) {
    res.status(400).send("User login failed: " + err.message);
  }
});

// Get the profile
app.get("/profile", userAuth, async (req, res) => {
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

    res.send("User profile data: " + user);
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
});

// Send the connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user; // We get the user object from the auth middleware
    // Sending a connection request
    console.log("Sending a connection request");
    res.send(user?.firstName + " sent the connection request successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  // Reading request from the API.
  const userEmail = req.body.email;

  try {
    const users = await User.findOne({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found!");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Feed API - GET/feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Deleting the user using DELETE/user with Model.findByIdAndDelete()
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete(_id: userId);
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Updating the user using PATCH/ hey user with Model.findByIdAndDelete()
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every(
      (k) => ALLOWED_UPDATES.includes(k) // Looping through each and every field of the data obj that the user wants to Update
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    if (data?.skills.length > 15) {
      throw new Error("Skills cannot be more than 15!");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after", // After state of the document will be logged to console
      runValidators: true, // Now valida                                        tor function will also run for updation.
    });
    console.log(user);
    res.send("User updated successfully!");
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log(" Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database connection cannot be established...");
  });
