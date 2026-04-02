const MealPlanner = require("../models/MealPlanner");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

async function getLoggedInUser(req) {
  if (!req.session.userId) return null;
  return await User.findById(req.session.userId);
}

async function getOrCreatePlanner(email) {
  let planner = await MealPlanner.findOne({ createdBy: email });
  if (!planner) {
    planner = await MealPlanner.create({ createdBy: email });
  }
  // Populate recipe inside each slot for all days
  await MealPlanner.populate(planner, {
    path: "monday.recipe tuesday.recipe wednesday.recipe thursday.recipe friday.recipe saturday.recipe sunday.recipe",
  });
  return planner;
}

// get meal planner
exports.getMealPlanner = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.redirect("/login");

    const planner = await getOrCreatePlanner(user.email);
    const recipes = await Recipe.find().sort({ title: 1 });

    return res.render("meal-planner", {
      planner,
      recipes,
      days: DAYS,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    return res.send("Error loading meal planner.");
  }
};

// Add new named slot
exports.addSlot = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.redirect("/login");

    const { day, slotName, recipeId } = req.body;
    if (!DAYS.includes(day) || !slotName || !slotName.trim())
      return res.redirect("/meal-planner");

    const slot = { name: slotName.trim(), recipe: recipeId || null };

    await MealPlanner.findOneAndUpdate(
      { createdBy: user.email },
      { $push: { [day]: slot } },
      { upsert: true },
    );

    return res.redirect("/meal-planner");
  } catch (error) {
    console.error(error);
    return res.send("Error adding slot.");
  }
};

// set recipe
exports.setSlotRecipe = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.redirect("/login");

    const { day, slotId, recipeId } = req.body;
    if (!DAYS.includes(day)) return res.redirect("/meal-planner");

    await MealPlanner.findOneAndUpdate(
      { createdBy: user.email, [`${day}._id`]: slotId },
      { $set: { [`${day}.$.recipe`]: recipeId || null } },
    );

    return res.redirect("/meal-planner");
  } catch (error) {
    console.error(error);
    return res.send("Error setting recipe.");
  }
};

// remove recipe slot
exports.removeRecipe = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.redirect("/login");

    const { day, slotId } = req.body;
    if (!DAYS.includes(day)) return res.redirect("/meal-planner");

    await MealPlanner.findOneAndUpdate(
      { createdBy: user.email, [`${day}._id`]: slotId },
      { $set: { [`${day}.$.recipe`]: null } },
    );

    return res.redirect("/meal-planner");
  } catch (error) {
    console.error(error);
    return res.send("Error removing recipe.");
  }
};

// delete the entire slot
exports.deleteSlot = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.redirect("/login");

    const { day, slotId } = req.body;
    if (!DAYS.includes(day)) return res.redirect("/meal-planner");

    await MealPlanner.findOneAndUpdate(
      { createdBy: user.email },
      { $pull: { [day]: { _id: slotId } } },
    );

    return res.redirect("/meal-planner");
  } catch (error) {
    console.error(error);
    return res.send("Error deleting slot.");
  }
};
