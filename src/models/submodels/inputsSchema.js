const mongoose = require("mongoose");

const inputsSchema = new mongoose.Schema({
  label: { type: String, required: false },
  inputType: { type: String, required: false },
  placeholder: { type: String, required: false },
  isCheckbox: { type: Boolean, required: false },
  isSelect: { type: Boolean, required: false },
  optionSelect: [
    {
      value: { type: String, required: false },
      label: { type: String, required: false },
    },
  ],
});

module.exports = inputsSchema;
