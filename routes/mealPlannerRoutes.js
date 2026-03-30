const express = require("express");
const router = express.Router();
const controller = require("../controllers/mealPlannerController");

router.get("/", controller.getMealPlanner);
router.post("/add-slot", controller.addSlot);
router.post("/set-recipe", controller.setSlotRecipe);
router.post("/remove-recipe", controller.removeRecipe);
router.post("/delete-slot", controller.deleteSlot);

module.exports = router;
