//Optional characters in routes:
app.get("/ab?c", (req, res) => {
  res.send("b is optional");
});