const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const slotSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  recipe: { type: ObjectId, ref: "Recipe", default: null }
});

const daySlots = { type: [slotSchema], default: [] };

const mealPlannerSchema = new mongoose.Schema({
  createdBy: { type: String, required: true, unique: true },
  monday:    daySlots,
  tuesday:   daySlots,
  wednesday: daySlots,
  thursday:  daySlots,
  friday:    daySlots,
  saturday:  daySlots,
  sunday:    daySlots,
});

module.exports = mongoose.model("MealPlanner", mealPlannerSchema);
