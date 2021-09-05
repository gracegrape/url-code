const express = require("express");
const app = express();
app.use(express.json()); //receive info in json format

// url shorten
// const { nanoid } = require("nanoid");
// const validUrl = require("valid-url");
// const localUrl = "http://localhost:3001";

app.use(function (req, res, next) {
  // allow access from angular local host
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

routes = require("./routes/api");
app.use("/", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log(`Listening on Port ${PORT}!`);
});

module.exports = app;
