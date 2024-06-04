const mongoose = require("mongoose");

const clinicalHistorySchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Types.ObjectId, ref: "Appointment" },
  patientId: { type: mongoose.Types.ObjectId, ref: "Users" },
  templateId: { type: mongoose.Types.ObjectId, ref: "Templates" },
  status: { type: String, require: true, enum: ["complete", "pending"] },
  values: {},
});

const ClinicalHistory = mongoose.model(
  "ClinicalHistory",
  clinicalHistorySchema
);

module.exports = ClinicalHistory;
