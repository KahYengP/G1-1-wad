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

const Category = mongoose.model('Category', categorySchema);

exports.getAll = () =>{
    return Category.find()
}
exports.addCategory = function(newCategory) {
  return Category.create(newCategory);
};

exports.findById = function(id) {
  return Category.findById(id);
};

exports.updateCategory = function(id, newName) {
  return Category.findByIdAndUpdate(id, {categoryName: newName}, {new:true});
};

exports.deleteCategory = function(id) {
  return Category.findByIdAndDelete(id);
};