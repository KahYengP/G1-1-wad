const Bookmark = require("../models/Bookmark");
const Recipe = require("../models/Recipe");
const Category = require("../models/Category");

exports.createBookmark = async (req, res) => {
  try {
    const userId = req.session.userId;
    const recipeId = req.body.recipeId;

    if (!userId) return res.redirect("/login");

    const existingRecipe = await Recipe.findByIdRecipe(recipeId);
    if (!existingRecipe) return res.redirect("/recipe");

    const existing = await Bookmark.findExisting(userId, recipeId);
    if (existing) {
      return res.redirect('/recipe?bookmarkError=Bookmark already added.')};

    await Bookmark.createBookmark({
      userId,
      recipeId,
      note: "",
      category: existingRecipe.category ? existingRecipe.category : null,
    });

    res.redirect('/bookmarks');
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
};

exports.readBookmarks = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect("/login");

    const bookmarks = await Bookmark.findByUserId(userId);
    res.render("bookmarks", { bookmarks, user: req.user });
  } catch (error) {
    console.error(error);
    res.send("Error loading bookmarks.");
  }
};

exports.updateBookmark = async (req, res) => {
  try {
    const userId = req.session.userId;
    const bookmarkId = req.body.bookmarkId;

    if (!userId) return res.redirect("/login");

    const updatedBookmark = await Bookmark.updateBookmark(bookmarkId, userId, {
      note: req.body.note,
      category: req.body.category,
    });

    if (!updatedBookmark) return res.send("Bookmark not found.");
    res.redirect("/bookmarks");
  } catch (error) {
    console.error(error);
    res.send("Error updating bookmark: " + error.message);
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const userId = req.session.userId;
    const bookmarkId = req.body.bookmarkId;

    if (!userId) return res.redirect("/login");

    const deletedBookmark = await Bookmark.deleteBookmark(bookmarkId, userId);
    if (!deletedBookmark) return res.send("Bookmark not found.");

    res.redirect("/bookmarks");
  } catch (error) {
    console.error(error);
    res.send("Error deleting bookmark.");
  }
};

exports.showEditBookmarkForm = async (req, res) => {
  try {
    const userId = req.session.userId;
    const bookmarkId = req.body.bookmarkId;

    if (!userId) return res.redirect("/login");

    const CategoryList = await Category.getAll();

    const bookmark = await Bookmark.findByIdAndUser(bookmarkId, userId);
    if (!bookmark) return res.send("Bookmark not found.");

    res.render("edit-bookmark", { bookmark, CategoryList });
  } catch (error) {
    console.error(error);
    res.send("Error loading the edit page.");
  }
};