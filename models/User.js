const mongoose = require("mongoose");

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
    type: [String],
    required: true,
  },
  security_answers: {
    type: [String],
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

// Get all users
exports.getAll = () => {
  return User.find().select("-password -security_answers");
};

// Find user by ID
exports.findById = (id) => {
  return User.findById(id);
};

// Find user by email
exports.findByEmail = (email) => {
  return User.findOne({ email: email });
};

// Find user by username
exports.findByUsername = (username) => {
  return User.findOne({ username: username });
};

// Create a new user
exports.createUser = (data) => {
  return User.create(data);
};

// Update user by ID
exports.updateById = (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

// Delete user by ID
exports.deleteById = (id) => {
  return User.findByIdAndDelete(id);
};

// Count total users
exports.countUsers = () => {
  return User.countDocuments();
};
