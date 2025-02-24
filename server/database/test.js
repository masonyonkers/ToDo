// This file tests your connection to a remote db based on your .env file.
// Can be run from root project directory with 'node server/database/test.js'.

require('dotenv').config({ path: './.env' });
console.log("MONGO_URI:", process.env.MONGO_URI);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Connection error:", err);
  });