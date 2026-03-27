const Category = require('../models/Category');

// use session in routes
exports.showCategory = async (req, res) => {
    try {
        const CategoryList = await Category.getAll();
        res.render("category", { CategoryList });
    } catch (error) {
        res.status(500).send("Error reading database");
    }
};

// show form
exports.showAddForm = (req, res) => {
    res.render("add-category", { msg: null, result: null });
};

// create form
exports.createCategory = async (req, res) => {
  // admin check
  if (!req.session.user || req.session.user.role !== "admin") {
    res.redirect('/profile');
  }
  const newcat = req.body.category
  let newCategory = {
    categoryName: newcat,
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

// edit
exports.showEditForm = async (req, res) => {
  try {
    let CategoryList = await Category.getAll();
    res.render("edit-category", { CategoryList });
  } catch (error) {
    res.send("Error loading categories");
  }
};

exports.getCategory = async (req, res) => {
  const category = req.query.category; // Get category from url
  try {
    let result = await Category.findByName(category);// find a book with isbn number
 
    res.render("update-category", {result:result ||null}); 
  } catch (error) {
    console.error(error);
   
  }
};

// update
exports.updateCategory = async (req, res) => {
  const oldName = req.body.oldCategory;    // hidden input in form
  const newName = req.body.category;       // updated value

  try {
    await Category.updateCategory(oldName, newName);
    res.send("Category has been successfully updated.");
  } catch (error) {
    console.error(error);
    res.send("Error updating category");
  }
};

// delete
exports.deleteCategory = async (req, res) => {
  const DeleteCategory = req.query.category

  try {
    let success = await Category.deleteCategory(DeleteCategory)
    res.send('Success')
  } catch (error) {
    res.send("Error deleting category");
  }
};
