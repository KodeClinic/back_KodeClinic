const mongoose = require("mongoose");

const medicalRecodSchema = new mongoose.Schema({
  patientId: { type: mongoose.Types.ObjectId, ref: "User" },
  templateId: { type: mongoose.Types.ObjectId, ref: "Templates" },
  values: {},
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecodSchema);

module.exports = MedicalRecord;
