const Recipe = require("../models/Recipe");
const mongoose = require("mongoose")

//ill do it in the format of read, create,update, delete see? rcud not crud

//get recipes and render it into the recipe ejs use foreach later
//read
exports.getRecipes = async (req,res)=>{
    try{
        const recipes = await Recipe.getAll();
        return res.render("recipe",{recipes:recipes})
    }
    catch(error){
        console.log(error);
        return res.render("error",{error:"Error in loading recipes"})
    }
}


exports.showAddform = (req,res)=>{
    try{
        return res.render("add-recipe")
    }
    catch(error){
        return res.send("Error in add form")
    }
}

//create
exports.createRecipes = async (req,res) =>{
    try{
        const title = req.body.title
        const ingredients = req.body.ingredients
        const instructions = req.body.instructions
        //
        const User = require("../models/User")

        if (!req.session.userId) {
            return res.redirect("/login")}

        const user = await User.findById(req.session.userId)

        if (!user) {
            return res.send("User not found")}

        const createdBy = user.email

        const data = {
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            createdBy: createdBy
        }

        //okay this part creates a new recipe to be added 
        const result = await Recipe.createRecipe(data)
console.log("SAVED:", result)

        // 
        return res.redirect("/recipe")
    }
    catch(error){
        console.log(error)
        return res.send("You've got an error");
    }
}

// Edit form, we will populate it with the preexisting data
//make sure that the recipe can be found
//then render the edit-recipe page
exports.showEditForm = async (req,res)=>{
    try{
        // fetch recipe so form can be pre-filled
        const recipe = await Recipe.findById(req.params.id)

        if (!recipe){
            return res.send("Recipe not found")
        }

        //  pass recipe to EJS
        return res.render("edit-recipe", { recipe })
    }
    catch(error){
        return res.send("There has been an error rendering edit recipe ")
    }
}

//update
exports.updateRecipes = async (req,res) => {
    try{
        //I'll be using params instead of query, because i plan to use /:id not ?id= etc 
        const id = req.params.id;

        // check if its a valid MongoDB ID (prevents crash)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send("Invalid ID")
        }

        //maybe i should make a new recipe 
        //check the recipe id first
        const recipe = await Recipe.findById(id)

        if (!recipe){
            return res.send("No ID has been found")
        }

        //check ownership(havent learn authentication so ill move on )
        // placeholder()
        const User = require("../models/User")
        const user = await User.findById(req.session.userId)

        if (recipe.createdBy !== user.email){
            return res.send("Not allowed")
        }

        //take data from add recipe 
        const title = req.body.title
        const ingredients = req.body.ingredients
        const instructions = req.body.instructions

        // declare data properly
        const data = {
            title:title,
            ingredients:ingredients,
            instructions:instructions,
        }

        //update using mongoose funciton 
        await Recipe.updateById(id,data)

        //redirect back to recipe in order to check if the change has been made
        return res.redirect("/recipe")
    }
    catch(error){
        //placeholder before i res.render("error") if we still doing that 
        return res.send("You've got an error updating this recipe")
    }
}

//delete 
exports.deleteRecipes = async (req,res) =>{
    try{
        const id = req.params.id
        const User = require("../models/User")
        //gets current userid 
        const user = await User.findById(req.session.userId)
        console.log("DELETE ID:", id)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send("Invalid ID")
        }

        const recipe = await Recipe.findById(id)

        if (!recipe){
            return res.send("No ID has been found")
        }
        //authorisation id 
        if (recipe.createdBy != user.email){
            return res.send("Not allowed")
        }
        await Recipe.deleteById(id);

        return res.redirect("/recipe");

    }catch(error){
        console.log(error)
        return res.send("Error deleting recipe")
    }
}
