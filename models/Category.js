const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [2, "Category name must be at least 2 characters"],
        maxlength: [10, "Category name cannot exceed 10 characters"]
    }
});

categorySchema.statics.getAll = function() {
  return this.find();
};

categorySchema.statics.addCategory = function(newCategory) {
  return this.create(newCategory);
};

categorySchema.statics.getCategory = function(id) {
  return this.findById(id);
};

categorySchema.statics.updateCategory = function(id, newName) {
  return this.findByIdAndUpdate(id, { categoryName: newName }, { new: true });
};

categorySchema.statics.deleteCategory = function(id) {
  return this.findByIdAndDelete(id);
};

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;