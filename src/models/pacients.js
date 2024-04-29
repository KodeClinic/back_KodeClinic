const mongoose = require("mongoose");

const pacientSchema = new mongoose.Schema({
  specialistId: { type: String, required: true },
  pxId: { type: String, required: true },
  pxName: { type: String, required: true },
  pxLastName: { type: String, required: true },
  pxBirthDate: { type: String, required: true },
  pxOcupation: { type: String, required: true },
  pxSex: { type: String, required: true },
  pxBloodType: { type: String, required: true },
  pxReligion: { type: String, required: true },
  pxEmail: { type: String, required: true },
  pxPhone: { type: Number, required: true },
  pxAddress: { type: String, required: true },
  pxColony: { type: String, required: true },
  pxState: { type: String, required: true },
  pxEmergencyContact: [
    {
      name1: { type: String, required: false },
      number1: { type: Number, required: false },
      relationship1: { type: String, required: false },
    },
    {
      name2: { type: String, required: false },
      number2: { type: Number, required: false },
      relationship2: { type: String, required: false },
    },
  ],
});

const PxInfo = mongoose.model("PxInfo", pacientSchema);

module.exports = PxInfo;
