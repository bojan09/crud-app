const express = require("express");

// init express app & middleware
const app = express();

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/books", (req, res) => {
  res.send("Welcome to the API");
});
