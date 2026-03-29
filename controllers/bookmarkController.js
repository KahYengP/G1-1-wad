const Bookmark = require("../models/Bookmark")
const Recipe = require("../models/Recipe")
const Category = require('../models/Category');

exports.createBookmark = async(req,res) => {
    try {
        const userId=req.session.userId
        const recipeId=req.body.recipeId
        const note=req.body.note
        const category=req.body.category

        if (!userId) {
            return res.redirect("/login")
        }
        const existingRecipe = await Recipe.findById(recipeId)
        if (!existingRecipe) {
            return res.send('Recipe not found.')
        }
        const existing = await Bookmark.findOne({userId:userId, recipeId: recipeId}).populate('recipeId').populate('category')
        if (existing) {
            return res.send('Recipe already bookmarked.')
        }

        const bookmark = new Bookmark({
            userId: userId, 
            recipeId: recipeId,
            note: note || "",
            category: existingRecipe.category._id
        })
        await bookmark.save()
        res.redirect('/bookmarks')
    } catch(error) {
        console.error(error)
        res.send(error.message)
    }
}

exports.readBookmarks = async(req,res) => {
    try {
        const userId=req.session.userId
        if (!userId) {
            return res.redirect('/login')
        }

        const bookmarks = await Bookmark.find({userId: userId}).populate('recipeId').populate('category')
        res.render("bookmarks", {bookmarks: bookmarks})
    } catch(error) {
        console.error(error)
        res.send("Error loading bookmarks.")
    }
}

exports.updateBookmark = async(req,res) => {
    try { 
        const userId=req.session.userId
        const bookmarkId=req.body.bookmarkId
        const note=req.body.note
        const category=req.body.category

        if (!userId) {
            return res.redirect('/login')
        }

        const updatedBookmark = await Bookmark.findOneAndUpdate( 
            {_id: bookmarkId, userId: userId}, 
            {note: note, category: category},
            {new: true}
        )
        if (!updatedBookmark) {
            return res.send('Bookmark not found.')
        }
        res.redirect('/bookmarks')
    } catch(error) {
        console.error(error)
        res.send("Error updating bookmark.")
    }
}

exports.deleteBookmark = async(req,res) => {
    try {
        const userId=req.session.userId
        const bookmarkId=req.body.bookmarkId

        if (!userId) {
            return res.redirect('/login')
        }
        const deletedBookmark = await Bookmark.findOneAndDelete( 
            {_id: bookmarkId, userId: userId}
        )
        if (!deletedBookmark) {
            return res.send("Bookmark not found.")
        }
        res.redirect("/bookmarks")
    } catch(error) {
        console.error(error)
        res.send('Error deleting bookmark.')
    }
}

exports.showEditBookmarkForm = async(req,res) => {
    try {
        const userId=req.session.userId
        const bookmarkId=req.body.bookmarkId

        if (!userId) {
            return res.redirect("/login")
        }
        
        const bookmark= await Bookmark.findOne({_id: bookmarkId, userId: userId}).populate('recipeId').populate('category')
        if (!bookmark) {
            return res.send('Bookmark not found.')
        }
        res.render('edit-bookmark', {bookmark})
    } catch(error) {
        console.error(error)
        res.send('Error loading the edit page.')
    }
} 