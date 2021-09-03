const express = require("express");
const app = express();

app.listen(3001, function () {
  console.log("Listening on Port 3001");
});

app.get("/", function (req, res) {
  res.send("Hello hello");
});
