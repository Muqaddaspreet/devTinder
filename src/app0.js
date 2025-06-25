const express = require("express");

const app = express();

// Request Handlers

//Optional characters in routes:
// app.get(/\/.*fly$/, (req, res) => {
//   res.send("it must end with fly");
// });

// app.get(/\/a(bc)+d/, (req, res) => {
//   res.send("bc is optional");
// });

// app.get(/\/a(bc)?d/, (req, res) => {
//   res.send("bc is optional");
// });

// app.get(/\/ab.*cd/, (req, res) => {
//   res.send("Everything between ab and cd is optional");
// });

// app.get(/\/ab?c/, (req, res) => {
//   res.send("b is optional");
// });

// app.get(/\/ab+c/, (req, res) => {
//   res.send("b is optional");
// });

// // This will only hanle GET call to /user
// app.get("/user", (req, res) => {
//   console.log(req.query);
//   res.send({ firstname: "Muqaddaspreet", lastname: "Singh" });
// });

// This will only hanle GET call to /user
app.get("/user/:userID", (req, res) => {
  console.log(req.params);
  res.send({ firstname: "Muqaddaspreet", lastname: "Singh" });
});

// This will only handle POST call to /user
app.post("/user", (req, res) => {
  console.log(" Save data to the database!");
  res.send("Data successfully saved to the database!");
});

// This will only handle DELETE call to /user
app.delete("/user", (req, res) => {
  res.send("Data is deleted successfully");
});

// This will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello from the server!");
});

//This will handle all the http calls to /user
app.use("/user", (req, res) => {
  res.send("HAHAHAHAHA!");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
