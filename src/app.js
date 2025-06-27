const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Sachin",
    lastName: "Tendulkar",
    emailId: "sachin@gmail.com",
    password: "sachin@123",
    _id: "471927634587629468908686",
  };

  try {
    await user.save(); // This function will return a promise.
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user. " + err.message);
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
