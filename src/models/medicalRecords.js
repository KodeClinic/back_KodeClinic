const mongoose = require("mongoose");

const medicalRecodSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  patientId: { type: mongoose.Types.ObjectId, ref: "User" },
  medicalBackground: {
    pathological: [{}],
    nonPathological: [{}],
    heredityFamiliar: [{}],
  },
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecodSchema);

module.exports = MedicalRecord;
