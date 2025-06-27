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

  // Creating a new instance of the user model
  const user = new User(userObj);

  await user.save(); // This function will return a promise.
  res.send("USer added successfully");
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
