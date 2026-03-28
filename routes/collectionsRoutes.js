const express = require("express")
const router = express.Router()
const controller = require("../controllers/collectionsController")

router.get("/", controller.getCollections)
router.get("/add", controller.showAddForm)
router.get("/edit/:id", controller.showEditForm)

router.post("/create", controller.createCollection)
router.post("/update/:id", controller.updateCollection)
router.post("/delete/:id", controller.deleteCollection)

router.post("/add-recipe", controller.addRecipe)
router.post("/remove-recipe", controller.removeRecipe)

module.exports = router 