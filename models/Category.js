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

module.exports = mongoose.model('Category', categorySchema);

exports.getAll = () =>{
    return Category.find()
}
exports.addCategory = function(newCategory) {
  return Category.create(newCategory);
};

exports.findByName = function(category) {
  return Category.findOne({ category:category });
};

exports.updateCategory = function(oldName, newName) {
  return Category.updateOne({categoryName: oldName}, {categoryName: newName});
};

exports.deleteCategory = function(DeleteCategory) {
  return Category.deleteOne({categoryName: DeleteCategory});
};