// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  security_questions: { type: [String], required: true },
  security_answers: { type: [String], required: true },
  dateCreated: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const User = mongoose.model("User", userSchema);

// Get all users
exports.getAll = () => User.find().select("-password -security_answers");

// Find user by ID
exports.findById = (id) => User.findById(id).select("-password -security_answers");

// Find user by ID with password (for password change)
exports.findByIdWithPassword = (id) => User.findById(id).select("+password");

// Find user by ID with security answers (for security update)
exports.findByIdWithAnswers = (id) => User.findById(id).select("+security_answers");

// Find user by email
exports.findByEmail = (email) => User.findOne({ email }).select("-password -security_answers");

// Find user by email with password
exports.findByEmailWithPassword = (email) => User.findOne({ email }).select("+password");

// Find user by email with security answers (for reset)
exports.findByEmailWithAnswers = (email) => User.findOne({ email }).select("+security_answers");

// Find user by username
exports.findByUsername = (username) => User.findOne({ username }).select("-password -security_answers");

// Create a new user
exports.createUser = (data) => User.create(data);

// Update user by ID
exports.updateById = (id, data) => User.findByIdAndUpdate(id, data, { new: true }).select("-password -security_answers");

// Delete user by ID
exports.deleteById = (id) => User.findByIdAndDelete(id);

// Update password only
exports.updatePassword = (id, hashedPassword) => User.findByIdAndUpdate(id, { password: hashedPassword });

// Update security questions
exports.updateSecurityQuestions = (id, newQuestions, hashedAnswers) => User.findByIdAndUpdate(id, {
  security_questions: newQuestions,
  security_answers: hashedAnswers
});

// Count total users
exports.countUsers = () => User.countDocuments();