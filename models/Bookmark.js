const mongoose=require("mongoose")

const bookmarkSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    recipeId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Recipe',
        required: true 
    }, 
    category:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true
    }, 
    note:{
        type: String, 
        default:""
    },
    createdAt:{
        type: Date,
        default: Date.now
    }   
})

module.exports = mongoose.model("Bookmark", bookmarkSchema)

