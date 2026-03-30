const fs = require('fs/promises');
const Category = require('../models/Category');
// use session in routes
exports.showCategory = async (req, res) => {
    try {
        const CategoryList = await Category.getAll();
        res.render("category", { CategoryList });
    } catch (error) {
        res.send(error.message);
    }
};

// show form
exports.showAddForm = (req, res) => {
    res.render("add-category", { msg: null, result: null });
};

// create form
exports.createCategory = async (req, res) => {

  const category = req.body.category
  let newCategory = {
    categoryName: category,
  }

  try {
    const result = await Category.addCategory(newCategory);
    let msg = "Success"
    res.render("add-category", { msg, result});
  } catch (error) {
    let msg = "Failure"
    let result = null
    res.render("add-category", { msg, result});
    }
};

exports.getCategory = async (req, res) => {
  const id = req.query.id;
  try {
    let result = await Category.findById(id);

    if (!result) {
      return res.send("Category not found");
    }
    res.render("update-category", { result });
  } catch (error) {
    res.send("Error loading category");
  }
};

// update
exports.updateCategory = async (req, res) => {
  const id = req.body.id;
  const newName = req.body.category;

  try {
    await Category.updateCategory(id, newName);
    res.redirect("/category"); // back to list
  } catch (error) {
    res.send("Error updating category");
  }
};

// delete
exports.deleteCategory = async (req, res) => {
  const id = req.body.id;

  try {
    await Category.deleteCategory(id);
    res.redirect("/category");
  } catch (error) {
    res.send("Error deleting category");
  }
};
