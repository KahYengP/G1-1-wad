const Category = require('../models/Category');


// use session in routes


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
  // check if admin
    if (!req.session.user) {
        console.log("User not logged in, redirecting to /login");
        return res.redirect('/login');
    }
    if (req.session.user.role !== "admin") {
        console.log("Not an admin user, redirecting to /profile");
        return res.redirect('/profile')
    };

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
    let msg = "Category added!";
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
  res.send("not done")
};

exports.deleteCategory = async (req, res) => {
  // delete category by ID
  res.send("not done")
};

