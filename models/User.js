const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  security_questions: { type: [String], required: true },
  security_answers: { type: [String], required: true },
  dateCreated: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Get all users
User.getAll = function() {
  return User.find().select('-password -security_answers');
};

// Find user by ID
User.findByIdUser = function(id) {
  return User.findById(id);
};

// Find user by email
User.findByEmail = function(email) {
  return User.findOne({ email });
};


// Find user by username
User.findByUsername = function(username) {
  return User.findOne({ username });
};

// Create a new user
User.createUser = function(data) {
  return User.create(data);
};

// Update user by ID
User.updateById = function(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true });
};

// Delete user by ID
User.deleteById = function(id) {
  return User.findByIdAndDelete(id);
};

// Update password only
User.updatePassword = function(id, hashedPassword) {
  return User.findByIdAndUpdate(id, { password: hashedPassword });
};

// Update security questions and answers
User.updateSecurityQuestions = function(id, newQuestions, hashedAnswers) {
  return User.findByIdAndUpdate(id, {
    security_questions: newQuestions,
    security_answers: hashedAnswers
  });
};

// Count total users
User.countUsers = function() {
  return User.countDocuments();
};

module.exports = User;