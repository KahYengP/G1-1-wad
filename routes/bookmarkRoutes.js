const express=require("express")
const router=express.Router()

const bookmarkController=require("../controllers/bookmarkController")

router.post("/bookmark/create", bookmarkController.createBookmark)
router.get("/bookmarks", bookmarkController.readBookmarks)
router.post("/bookmark/update", bookmarkController.updateBookmark)
router.post("/bookmark/delete", bookmarkController.deleteBookmark)
router.post("/bookmark/edit", bookmarkController.showEditBookmarkForm)

module.exports=router