const mongoose = require("mongoose");

const medicalRecodSchema = new mongoose.Schema({
  // _id: mongoose.Types.ObjectId,
  patientId: { type: mongoose.Types.ObjectId, ref: "User" },
  templateId: { type: mongoose.Types.ObjectId, ref: "Templates" },
  values: {},
  // medicalBackground: {
  //   pathological: {
  //     screenTemplateId: {
  //       type: mongoose.Types.ObjectId,
  //       ref: "Templates.screens",
  //     },
  //     results: [],
  //   },
  //   nonPathological: [{}],
  //   heredityFamiliar: [{}],
  // },
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecodSchema);

module.exports = MedicalRecord;
