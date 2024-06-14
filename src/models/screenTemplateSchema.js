const mongoose = require("mongoose");
const sectionTemplateSchema = require("./sectionTemplateSchema");
const inputsSchema = require("./inputsSchema");

const screenTemplateSchema = new mongoose.Schema({
  title: { type: String, required: false },
  sections: [sectionTemplateSchema],
  inputList: [inputsSchema],
  screenNumber: { type: Number, required: false },
});

module.exports = screenTemplateSchema;
