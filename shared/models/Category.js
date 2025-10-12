const { Schema, model } = require("mongoose");
const categorySchema = new Schema({
    name: { type: String, required: true },
    isActive: {
        type: Boolean, default: true
    },
    description: {
        type: String,
        default: ""
    }
},{timestamps:true});
module.exports = model("categories",categorySchema)