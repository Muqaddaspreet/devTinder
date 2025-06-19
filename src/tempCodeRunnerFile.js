// Request Handler
app.use("/test", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello from the server!");
});
