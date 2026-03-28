const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 10
  }
});

const Category = mongoose.model('Category', categorySchema);

Category.getAll = function() {
  return Category.find();
};

Category.addCategory = function(newCategory) {
  return Category.create(newCategory);
};

Category.updateCategory = function(id, newName) {
  return Category.findByIdAndUpdate(id, { categoryName: newName }, { new: true });
};

Category.deleteCategory = function(id) {
  return Category.findByIdAndDelete(id);
};

module.exports = Category;