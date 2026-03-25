// xin hee
// to add/edit/update/delete category for admins only?
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController")

// Define a GET route to display the list of category
router.get("/category", categoryController.showCategory);

// Define GET/POST route to display add form and submit form
router.get("/categoryAdd", categoryController.showAddForm);
router.post("/categoryAdd", categoryController.createCategory);

// Define GET/POST route to display all books/edit one category and update result
router.get("/categoryEdit", categoryController.showEditForm);
router.post("/categoryUpdate", categoryController.updateCategory);
router.post("/categoryDelete", categoryController.deleteCategory);

modules.export(router);