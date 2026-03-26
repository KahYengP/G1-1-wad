// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  security_questions: {
    type: [String],      // array of exactly 3 questions
    required: true,
  },
  security_answers: {
    type: [String],      // array of exactly 3 hashed answers
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);