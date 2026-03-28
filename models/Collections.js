const mongoose = require("mongoose")

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  createdBy: {
    type: String, // same as recipe (email)
    required: true
  },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

collectionSchema.statics.createCollection = function(data) {
  return this.create(data)
}

collectionSchema.statics.getAll = function(userEmail) {
  return this.find({ createdBy: userEmail }).populate("recipes")
}

collectionSchema.statics.updateById = function(id, data) {
  return this.findByIdAndUpdate(id, data)
}

collectionSchema.statics.deleteById = function(id) {
  return this.findByIdAndDelete(id)
}

module.exports = mongoose.model("Collection", collectionSchema)