const mongoose = require("mongoose");
const inputsSchema = require("./inputsSchema");

const sectionTemplateSchema = new mongoose.Schema({
  name: { type: String, required: false },
  description: { type: String, required: false },
  isVisible: { type: Boolean, required: false },
  inputList: [inputsSchema],
});

module.exports = sectionTemplateSchema;
