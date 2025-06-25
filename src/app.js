const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
  res.send(" User logged in successfully!");
});

app.get("/user/data", userAuth, (req, res) => {
  res.send("User data sent!");
});

app.get("/admin/getAllData", (req, res) => {
  // Logic of fetching all data
  res.send("All Data Sent!");
});

app.get("/admin/deleteUser", (req, res) => {
  // Logic of deleting the user
  res.send("Deleted a user");
});

app.listen(3000, () => {
  console.log("Successfully listening on port 3000...");
});
