//kh part 
const mongoose = require("mongoose");
//This is how recipe looks like in the mongoose database
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    //if no image is shown then depict default.jpg(its a placeholder)
    image: { type: String, default: "/images/default.jpg" },
    //we really need this because it gives reference on user who created it hence id
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Recipe = mongoose.model("Recipe", recipeSchema);

//below are my the database functions for recipe
//imma be using short hand function cuz its cool

//get all recipes,
exports.getAll = () =>{
    return Recipe.find()
}

//create new recipe 
exports.createRecipe = (data) =>{
    return Recipe.create(data)
}

//find one recipe by id (this is for updating + delete  later)
// i will be using mongooses _id(e.g "_id": "65f1a2b3c4d5e6f7890abc12" ) for this
// i will be using req.params after this regarding _id anyways
exports.findById = (id) =>{
    return Recipe.findbyID(id)
}

// update recipe by id 
//findByIDAndUpdate(mongoose command) helps to find one document and update it
//{new: true} makes it so that the data updated are the most recent because i wanna redirect back
exports.updateById = (id,data) =>{
    return Recipe.findByIDAndUpdate(id,data,{new:true})
}

// delete recipe by id
// same same but using findByIdAndDelete this time
exports.deleteById = (id)=>{
    return Recipe.findByIdAndDelete(id);
}