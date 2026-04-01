const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  note: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

Bookmark.findByUserId = function(userId) {
  return Bookmark.find({ userId }).populate("recipeId").populate("category");
};

Bookmark.findByIdAndUser = function(bookmarkId, userId) {
  return Bookmark.findOne({ _id: bookmarkId, userId }).populate("recipeId").populate("category");
};

Bookmark.findExisting = function(userId, recipeId) {
  return Bookmark.findOne({ userId, recipeId });
};

Bookmark.createBookmark = function(data) {
  return Bookmark.create(data);
};

Bookmark.updateBookmark = function(bookmarkId, userId, data) {
  return Bookmark.findOneAndUpdate({ _id: bookmarkId, userId }, data, { new: true });
};

Bookmark.deleteBookmark = function(bookmarkId, userId) {
  return Bookmark.findOneAndDelete({ _id: bookmarkId, userId });
};

module.exports = Bookmark;