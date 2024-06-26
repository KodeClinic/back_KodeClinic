const mongoose = require("mongoose");
const screenTemplateSchema = require("./screenTemplateSchema");

const templateSchema = new mongoose.Schema({
  templateID: { type: Number, unique: true, require: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  isVisible: { type: Boolean, required: true },
  screens: [screenTemplateSchema],
});

const Template = mongoose.model("Templates", templateSchema);

module.exports = Template;
