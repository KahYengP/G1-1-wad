//kh part
const mongoose = require("mongoose");
//This is how recipe looks like in the mongoose database
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  //if no image is shown then depict default.jpg(its a placeholder)    //we really need this because it gives reference on user who created it hence id

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // reference your Category model
    required: true,
  },

  createdBy: {
    type: String, //reserverd for the email
    required: true,
  },
  image: { type: String, default: "/images/default.jpg" },
  createdByUsername: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

//below are my the database functions for recipe
//imma be using short hand function cuz its cool

//get all recipes,
// exports.getAll = () => {
//   return Recipe.find().populate("category");
// };

// //create new recipe
// exports.createRecipe = (data) => {
//   return Recipe.create(data);
// };

// //find one recipe by id (this is for updating + delete  later)
// // i will be using mongooses _id(e.g "_id": "65f1a2b3c4d5e6f7890abc12" ) for this
// // i will be using req.params after this regarding _id anyways
// exports.findById = (id) => {
//   return Recipe.findById(id);
// };

// // update recipe by id
// //findByIDAndUpdate(mongoose command) helps to find one document and update it
// //{new: true} makes it so that the data updated are the most recent because i wanna redirect back
// exports.updateById = (id, data) => {
//   return Recipe.findByIdAndUpdate(id, data, { new: true });
// };

// // delete recipe by id
// // same same but using findByIdAndDelete this time
// exports.deleteById = (id) => {
//   return Recipe.findByIdAndDelete(id);
// };

module.exports = Recipe