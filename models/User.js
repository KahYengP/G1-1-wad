// models/User.js
const mongoose = require('mongoose');

// Define a simple User schema (MongoDB collection shape)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // usernames must be unique
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  }
});

// Export it as a model so we can use it in controllers
module.exports = mongoose.model('User', userSchema);
