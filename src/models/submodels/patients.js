const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  specialistId: { type: String, required: true },
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

const PatientInformationSchema = mongoose.model(
  "PatientInformationSchema",
  PatientSchema
);

module.exports = PatientInformationSchema;
