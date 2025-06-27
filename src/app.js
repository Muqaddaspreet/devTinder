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
