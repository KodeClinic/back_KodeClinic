const mongoose = require("mongoose");

const pacientSchema = new mongoose.Schema({
  specialistId: {
    type: String,
    required: true,
  },
  pxId: {
    type: String,
    required: true,
  },
  pxName: {
    type: String,
    required: true,
  },
  pxLastName: {
    type: String,
    required: true,
  },
  pxBirthDate: {
    type: String,
    required: true,
  },
  pxOcupation: {
    type: String,
    required: true,
  },
  pxSex: {
    type: String,
    required: true,
  },
  pxBloodType: {
    type: String,
    required: true,
  },
  pxReligion: {
    type: String,
    required: true,
  },
});

const PxInfo = mongoose.model("PxInfo", pacientSchema);

module.exports = PxInfo;
