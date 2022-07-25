// import mongo clients

// destructures the MongoDB clients
const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  // establish connection to database
  //   cb - callback function
  //   passing a callback function that fires after we connect to the local db. So that's either success to the connection or a failure (err)
  connectToDb: (cb) => {
    // uses a connection string as an argument to connect
    // connecting to local database
    MongoClient.connect("mongodb://localhost:27017/bookstore")
      .then((client) => {
        // return database connection
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },

  // return database connection
  getDb: () => dbConnection, // return a value from database
};
