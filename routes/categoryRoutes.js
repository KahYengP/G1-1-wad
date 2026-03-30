// xin hee
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require('../middleware/authMiddleware');

// Define a GET route to display the list of category
router.get("/category", authMiddleware.isAuthenticated, categoryController.showCategory);

// Define GET/POST route to display add form and submit form
router.get("/add-category", authMiddleware.isAuthenticated, authMiddleware.isAdmin, categoryController.showAddForm);
router.post("/add-category", authMiddleware.isAuthenticated, authMiddleware.isAdmin, categoryController.createCategory);

// Define GET/POST route to display all category/edit one category and update result
router.get("/update-category", authMiddleware.isAuthenticated, authMiddleware.isAdmin, categoryController.getCategory);
router.post("/update-category", authMiddleware.isAuthenticated, authMiddleware.isAdmin, categoryController.updateCategory);
router.post("/delete-category", authMiddleware.isAuthenticated, authMiddleware.isAdmin, categoryController.deleteCategory);

module.exports = router;
