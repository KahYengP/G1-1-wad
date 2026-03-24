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
        res.render("error",{error:"Error in loading recipes"})
    }
}
//create
exports.createRecipes = async (req,res) =>{
    try{
        const title = req.body.title
        const ingredients = req.body.ingredients
        const instructions = req.body.instructions
        //
        const createdBy = req.user.id
        const data = {
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            image: "/images/default.jpg",
            createdBy: createdBy
        }
        //okay this part creates a new recipe to be added 
        //new recipes will have just the default image 
        await Recipe.createRecipe(data)
        //this will redirect back to the main page, so we can see our change to recipes
        res.redirect("/recipe")
    }
    catch(error){
        console.log(error)
        res.render("error", { error: "Error creating recipe" })
    }
}

//update
exports.updateRecipes = async (req,res) => {
    try{
        //I'll be using params instead of query, because i plan to use /:id not ?id= etc 
        const id = req.params.id;
        //maybe i should make a new recipe 
        //check the recipe id first
        const recipe = await Recipe.findById(id)
        if (!recipe){
            res.send("No ID has been found")
        }
        //check ownership(havent learn authentication so ill move on )
        // placeholder()
        //take data from add recipe 
        const title = req.body.title
        const ingredients = req.body.ingredients
        const instructions = req.body.instructions
        const image = req.body.image
        data = {
            title:title,
            ingredients:ingredients,
            instructions:instructions,
            image:image
        }
        //update using mongoose funciton 
        await Recipe.updateById(id,data)
        //redirect back to recipe in order to check if the change has been made
        res.redirect("/recipe")
    }
    catch(error){
        //placeholder before i res.render("error") if we still doing that 
        res.send("You've got an error updating this recipe")

    }
}

//delete 
exports.deleteRecipes = async (req,res) =>{
    try{
        const id = req.params.id
        const recipe = Recipe.findId(id)
        if (!recipe){
            res.send("No ID has been found")
        }
        //authenticaiton placeholder

        await Recipe.deleteById(id);
        res.redirect("/recipe");
    }catch(error){
        res.send("You got an error deleting this recipe")
    }
}