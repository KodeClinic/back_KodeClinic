const mongoose = require("mongoose");
const inputsSchema = require("../submodels/inputsSchema");

const sectionTemplateSchema = new mongoose.Schema({
  // _id: mongoose.Types.ObjectId,
  name: { type: String, required: false },
  description: { type: String, required: false },
  isVisible: { type: Boolean, required: false },
  inputList: [inputsSchema],
});

module.exports = sectionTemplateSchema;
