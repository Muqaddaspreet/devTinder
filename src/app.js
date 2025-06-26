const express = require("express");

const app = express();

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("Something went wrong!");
  }
});

app.get("/user", (req, res) => {
  try {
    // Logic of DB call and get user data
    //throwing a random error for demo:
    throw new Error("hahacghg");
    res.send("User Data Sent");
  } catch {
    res.status(500).send("Some Error! Contact Support team!");
  }
});
app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
