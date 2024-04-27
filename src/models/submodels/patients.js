const mongoose = require("mongoose");

const PatientInformationSchema = new mongoose.Schema({
  occupation: { type: String, required: false },
  bloodType: { type: String, required: false },
  religion: { type: String, required: false },
  emergencyContact: [
    {
      number: { type: String, required: false },
      relationship: { type: String, required: false },
    },
  ],
});

module.exports = PatientInformationSchema;