const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Using the routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// // Register the user
// authRouter.post("/signup", async (req, res) => {...});

// // Login the user
// app.post("/login", async (req, res) => {...});

// // Get the profile
// app.get("/profile", userAuth, async (req, res) => {...});

// // Send the connection request
// app.post("/sendConnectionRequest", userAuth, async (req, res) => {...});

// // Get user by email
// app.get("/user", async (req, res) => {
//   // Reading request from the API.
//   const userEmail = req.body.email;

//   try {
//     const users = await User.findOne({ email: userEmail });
//     if (users.length === 0) {
//       res.status(404).send("User not found!");
//     }
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

// // Feed API - GET/feed - get all the users from the database
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // Deleting the user using DELETE/user with Model.findByIdAndDelete()
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     // const user = await User.findByIdAndDelete(_id: userId);
//     const user = await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully!");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // Updating the user using PATCH/ hey user with Model.findByIdAndDelete()
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

//     const isUpdateAllowed = Object.keys(data).every(
//       (k) => ALLOWED_UPDATES.includes(k) // Looping through each and every field of the data obj that the user wants to Update
//     );

//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed!");
//     }

//     if (data?.skills.length > 15) {
//       throw new Error("Skills cannot be more than 15!");
//     }

//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after", // After state of the document will be logged to console
//       runValidators: true, // Now valida                                        tor function will also run for updation.
//     });
//     console.log(user);
//     res.send("User updated successfully!");
//   } catch (err) {
//     res.status(400).send("Update failed: " + err.message);
//   }
// });

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
