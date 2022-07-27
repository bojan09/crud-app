const express = require("express");
// destructuring
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");

// init express app & middleware
const app = express();

// using middleware, so that we can use the req.body bellow
app.use(express.json());

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

app.get("/books/:id", (req, res) => {
  // checking to see if the id is valid
  if (ObjectId.isValid(req.params.id)) {
    //! req.params.id -- getting access to whatever the value is of the :id
    db.collection("books")
      // finding a single document inside the collection
      // using a filter to find the document
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Couldn't fetch the document" });
      });
  } else {
    res.status(500).json({ errror: "Not a valid document id!" });
  }
});

//! post requests
// add new books
app.post("/books", (req, res) => {
  // getting the body
  const book = req.body;

  // adding a object to the books collection
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't create a new document" });
    });
});

//! delete requests
// delete books
app.delete("/books/:id", (req, res) => {
  // checking the id to see if it's valid
  if (ObjectId.isValid(req.params.id)) {
    // from this collection
    db.collection("books")
      // if valid then delete the document by the given id
      .deleteOne({ _id: ObjectId(req.params.id) })
      // once that's done we get the result back from MongoDB
      .then((result) => {
        res
          .status(200)
          .json(result)
          // if there's an error we catch it
          .catch((err) => {
            res.status(500).json({ error: "Couldn't delete the document" });
          });
      });
  } else {
    res.status(500).json({ error: "Not a valid document id" });
  }
});

// patch request
// update existing books in database

app.patch("/books/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      // takes two arguments one is selecting the id, the second argument updateing any field we pass
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res
          .status(200)
          .json(result)
          .catch((err) => {
            res.status(500).json({ error: "Couldn't update the document" });
          });
      });
  } else {
    res.status(500).json({ error: "Not a valid document id" });
  }
});
