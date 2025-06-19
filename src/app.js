const express = require("express");

const app = express();

// Request Handler
app.use("/", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello from the server!");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
