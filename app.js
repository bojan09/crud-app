const express = require("express");
// destructuring
const { connectToDb, getDb } = require("./db");

// init express app & middleware
const app = express();

// database connection
let db;

// if the connection is a success, the error will be null
connectToDb((err) => {
  if (!err) {
    // listening for request, only after we successfully connected to the database
    app.listen(8080, () => {
      console.log("Server running on port 8080");
    });
    // using this variable to fetch data,update,delete exc
    db = getDb();
  }
});

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/books", (req, res) => {
  let books = [];
  // getting all the books from the bookstore
  db.collection("books")
    .find()
    .sort({ author: 1 })
    // gives us an array of all of our books
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Couldn't get the documents" });
    });
});
