const Category = require('../models/Category');
exports.showCategory = async (req, res) => {
  // fetch category 
  try{
    let CategoryList = await CategoryList.retrieveAll()
    res.render("category", { CategoryList });
  } catch (error) {
    res.send("Error reading database");
  }
};

exports.showAddForm = (req, res) => {
  // render add category form
  let submission = ""
  res.render("add-category", {submission})
};

exports.createCategory = async (req, res) => {
  // save new category 
  const category = req.body.category
  if (!category || category.trim() === "") {
    let msg = "Category name is required.";
    res.render("add-category", { msg }); // show error
    return;
  }
  let CreateCategory = {
    category : category
  }
  try {
    let result = await Category.addCategory(CreateCategory); //addCategory model 
    let msg="Category added!";
     res.render("add-category", {result:result || null, msg}); 
  } catch (error) {
    let result = null
    let msg = "Failed to add category"
    res.render('add-category', {result, msg})
  }
};

exports.showEditForm = async (req, res) => {
  // render edit form
  try {
    let CategoryList = await CategoryList.retrieveAll()
    res.render("edit-category", { CategoryList });
  } catch (error) {
    res.send("Error reading database");
  }
};

exports.updateCategory = async (req, res) => {
  // get updated data from req.body
  // update category in DB
};

exports.deleteCategory = async (req, res) => {
  // delete category by ID
};

