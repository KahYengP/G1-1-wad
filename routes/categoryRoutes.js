// xin hee
// to add/edit/update/delete category for admins only?
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Define a GET route to display the list of category
router.get("/category", categoryController.showCategory);

// Define GET/POST route to display add form and submit form
router.get("/add-category", categoryController.showAddForm);
router.post("/add-category", categoryController.createCategory);

// Define GET/POST route to display all category/edit one category and update result
router.get("/edit-category", categoryController.showEditForm);
router.get("/update-category", categoryController.getCategory);
router.post("/update-category", categoryController.updateCategory);
router.post("/delete-category", categoryController.deleteCategory);

module.exports = router;
