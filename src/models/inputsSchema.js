const mongoose = require("mongoose");

const inputsSchema = new mongoose.Schema({
  propertyName: { type: String, required: false },
  label: { type: String, required: false },
  inputType: { type: String, required: false },
  placeholder: { type: String, required: false },
  optionSelect: [
    {
      value: { type: String, required: false },
      label: { type: String, required: false },
    },
  ],
});

module.exports = inputsSchema;
