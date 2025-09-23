const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);

  // Creating a new instance of the user model
  const user = new User(req.body);

  try {
    await user.save(); // This function will return a promise.
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user. " + err.message);
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
