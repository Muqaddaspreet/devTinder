const express = require("express");

const app = express();

// app.use(
//   "/user",
//   [
//     (req, res, next) => {
//       // Route Handler 1
//       console.log("Handling the route user!!");
//       next();
//       // res.send("Response!!");
//     },
//     (req, res, next) => {
//       // Route Handler 2
//       console.log("Handling the route user2!!");
//       // res.send("Response2!!");
//       next();
//     },
//   ]
// );

app.use("/user", [
  (req, res, next) => {
    // Route Handler 1
    console.log("Handling the route user!!");
    next();
    // res.send("Response!!");
  },
]);

app.use("/user", [
  (req, res, next) => {
    // Route Handler 2
    console.log("Handling the route user2!!");
    res.send("Response2!!");
  },
]);

app.listen(3000, () => {
  console.log("Successfully listening on port 3000...");
});
