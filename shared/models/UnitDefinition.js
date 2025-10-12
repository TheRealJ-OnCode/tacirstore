const { Schema, model } = require("mongoose");
const unitDefinitionSchema = new Schema({
    name: { type: String, required: true,unique:true }, // "Qutu"
    baseUnit: { type: String, required: true }, // "Eded"
    conversionRate: { type: Number, required: true }, // 6
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = model("unitDefinitions", unitDefinitionSchema);