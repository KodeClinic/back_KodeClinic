const mongoose = require("mongoose");
const sectionTemplateSchema = require("../submodels/sectionTemplateSchema");
const inputsSchema = require("../submodels/inputsSchema");

const screenTemplateSchema = new mongoose.Schema({
  title: { type: String, required: false },
  sections: [sectionTemplateSchema],
  inputList: [inputsSchema],
  screenNumber: { type: Number, required: false },
});

module.exports = screenTemplateSchema;
